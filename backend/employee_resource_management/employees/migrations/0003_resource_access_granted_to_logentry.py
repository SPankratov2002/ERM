# Generated by Django 5.1.2 on 2024-10-14 06:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0002_employee_email'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='access_granted_to',
            field=models.ManyToManyField(blank=True, related_name='accessible_resources', to='employees.employee'),
        ),
        migrations.CreateModel(
            name='LogEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=255)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('details', models.TextField(blank=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_log_entries', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
