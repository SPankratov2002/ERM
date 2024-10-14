from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()


class LogEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_log_entries')
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    def __str__(self):
        return f'{self.user} - {self.action} at {self.timestamp}'


class Department(models.Model):
    name = models.CharField(max_length=255)
    manager = models.OneToOneField('Employee', null=True, blank=True, on_delete=models.SET_NULL, related_name='managed_department')

    def __str__(self):
        return self.name


class Employee(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()  # Добавлено поле email для корректной работы метода clean
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    is_access_restricted = models.BooleanField(default=False)
    restricted_employees = models.ManyToManyField('self', symmetrical=False, related_name='restricted_by', blank=True)

    def clean(self):
        if self.email and not self.email.endswith('@example.com'):
            raise ValidationError('Email должен оканчиваться на @example.com')

    def __str__(self):
        return f'{self.name} ({self.department})'


class Resource(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='resources')
    access_granted_to = models.ManyToManyField(Employee, related_name='accessible_resources', blank=True)

    def clean(self):
        if len(self.name) < 3:
            raise ValidationError('Resource name must be at least 3 characters long')

    def __str__(self):
        return f'Resource: {self.name} owned by {self.owner.name}'

def log_action(user, action, details=""):
    LogEntry.objects.create(user=user, action=action, details=details)