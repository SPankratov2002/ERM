from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, F
from .models import Department, Employee, Resource, log_action
from .serializers import DepartmentSerializer, EmployeeSerializer, ResourceSerializer

User = get_user_model()


class IsOwnerOrManager(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Получение сотрудника, связанного с текущим пользователем
        try:
            employee = request.user.employee_profile
        except Employee.DoesNotExist:
            return False

        if isinstance(obj, Resource):
            return obj.owner == employee or (hasattr(obj.owner, 'managed_department') and obj.owner.managed_department and obj.owner.managed_department.manager == employee) or request.user.is_superuser
        return False


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def access_given_by_employees(self, request):
        """
        Получить количество доступов, разданных каждым сотрудником отдела
        """
        employees = Employee.objects.annotate(access_count=Count('resources'))
        data = [
            {
                'employee': employee.name,
                'department': employee.department.name if employee.department else 'Не указано',
                'access_count': employee.access_count
            }
            for employee in employees
        ]
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def access_given_to_other_departments(self, request):
        """
        Получить количество разданных доступов на другие отделы с названиями отделов
        """
        resources = Resource.objects.filter(~Q(owner__department=F('access_granted_to__department')))
        data = [
            {
                'resource': resource.name,
                'owner_department': resource.owner.department.name if resource.owner.department else 'Не указано',
                'granted_to_department': employee.department.name if employee.department else 'Не указано'
            }
            for resource in resources
            for employee in resource.access_granted_to.all()
        ]
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def employees_with_more_than_three_accesses(self, request):
        """
        Получить список сотрудников, которым выдано более 3-х доступов к ресурсам
        """
        employees = Employee.objects.annotate(access_count=Count('accessible_resources')).filter(access_count__gt=3)
        data = [
            {
                'employee': employee.name,
                'department': employee.department.name if employee.department else 'Не указано',
                'access_count': employee.access_count
            }
            for employee in employees
        ]
        return Response(data, status=status.HTTP_200_OK)


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOwnerOrManager])
    def grant_access(self, request, pk=None):
        """
        Предоставить доступ к ресурсу сотруднику
        """
        resource = self.get_object()
        employee_id = request.data.get('employee_id')

        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        employee = get_object_or_404(Employee, pk=employee_id)

        # Проверка на ограничения доступа
        if employee.is_access_restricted and resource.owner not in employee.restricted_employees.all():
            return Response({'error': 'Access is restricted for this employee'}, status=status.HTTP_403_FORBIDDEN)

        # Предоставление доступа
        resource.access_granted_to.add(employee)
        log_action(request.user, 'Granted access', details=f'Access granted to {employee.name} for resource {resource.name}')
        return Response({'status': f'Access granted to {employee.name}'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOwnerOrManager])
    def revoke_access(self, request, pk=None):
        """
        Отозвать доступ к ресурсу от сотрудника
        """
        resource = self.get_object()
        employee_id = request.data.get('employee_id')

        if not employee_id:
            return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        employee = get_object_or_404(Employee, pk=employee_id)

        if resource.owner == request.user.employee_profile or (hasattr(resource.owner, 'managed_department') and resource.owner.managed_department and resource.owner.managed_department == employee.department) or request.user.is_superuser:
            resource.access_granted_to.remove(employee)
            log_action(request.user, 'Revoked access', details=f'Access revoked from {employee.name} for resource {resource.name}')
            return Response({'status': f'Access revoked from {employee.name}'}, status=status.HTTP_200_OK)

        return Response({'error': 'You are not allowed to revoke this access'}, status=status.HTTP_403_FORBIDDEN)