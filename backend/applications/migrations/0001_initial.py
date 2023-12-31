# Generated by Django 5.0 on 2023-12-08 22:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        ('petlistings', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form', models.JSONField(default=dict)),
                ('status', models.CharField(choices=[('accepted', 'Accepted'), ('denied', 'Denied'), ('pending', 'Pending'), ('adopted', 'Withdrawn')], default='pending', max_length=8)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('pet_listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='petlistings.petlisting')),
                ('pet_seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.seeker')),
                ('shelter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.shelter')),
            ],
        ),
    ]
