# Generated manually to support PLN, Genset, Fuel, and MPPT Solar fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='rectifierdata',
            name='pln_voltage',
            field=models.FloatField(blank=True, default=220.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='pln_current',
            field=models.FloatField(blank=True, default=15.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='pln_frequency',
            field=models.FloatField(blank=True, default=50.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='pln_status',
            field=models.CharField(default='Normal', max_length=20),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='genset_status',
            field=models.CharField(default='Mati', max_length=20),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='genset_voltage',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='genset_current',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='genset_frequency',
            field=models.FloatField(blank=True, default=0.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='fuel_level_liter',
            field=models.FloatField(blank=True, default=120.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='fuel_capacity_liter',
            field=models.FloatField(blank=True, default=200.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='mppt_pv_voltage',
            field=models.FloatField(blank=True, default=65.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='mppt_pv_current',
            field=models.FloatField(blank=True, default=12.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='mppt_pv_power',
            field=models.FloatField(blank=True, default=780.0, null=True),
        ),
        migrations.AddField(
            model_name='rectifierdata',
            name='mppt_daily_energy',
            field=models.FloatField(blank=True, default=4.8, null=True),
        ),
    ]

