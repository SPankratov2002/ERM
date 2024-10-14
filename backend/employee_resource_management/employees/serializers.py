from rest_framework import serializers
from .models import Employee, Department, Resource


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']


class EmployeeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    accessible_resources = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'name', 'email', 'department', 'accessible_resources']

    def get_accessible_resources(self, obj):
        resources = obj.accessible_resources.all()
        return ResourceSummarySerializer(resources, many=True).data


class ResourceSummarySerializer(serializers.ModelSerializer):
    """Сериализатор для краткого представления ресурсов, чтобы избежать рекурсии"""
    class Meta:
        model = Resource
        fields = ['id', 'name']


class ResourceSerializer(serializers.ModelSerializer):
    owner = EmployeeSerializer(read_only=True)  # Используйте EmployeeSerializer для полного представления владельца
    access_granted_to = EmployeeSerializer(many=True, read_only=True)

    class Meta:
        model = Resource
        fields = ['id', 'name', 'owner', 'access_granted_to']
