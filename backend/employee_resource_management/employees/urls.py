from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, EmployeeViewSet, ResourceViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'resources', ResourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('employees/access_given_by_employees/', EmployeeViewSet.as_view({'get': 'access_given_by_employees'}), name='access_given_by_employees'),
    path('employees/access_given_to_other_departments/', EmployeeViewSet.as_view({'get': 'access_given_to_other_departments'}), name='access_given_to_other_departments'),
    path('employees/employees_with_more_than_three_accesses/', EmployeeViewSet.as_view({'get': 'employees_with_more_than_three_accesses'}), name='employees_with_more_than_three_accesses'),
]
