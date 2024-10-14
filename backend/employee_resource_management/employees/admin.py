from django.contrib import admin
from .models import Employee, Department, Resource, LogEntry

admin.site.register(Employee)
admin.site.register(Department)
admin.site.register(Resource)
admin.site.register(LogEntry)