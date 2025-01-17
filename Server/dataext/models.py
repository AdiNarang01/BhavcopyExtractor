from django.db import models

# Create your models here.

class Bhavcopy(models.Model):
    code = models.IntegerField() 
    name = models.CharField(max_length=100)  
    open = models.FloatField (default=0)
    high = models.FloatField(default=0)
    low = models.FloatField(default=0)
    close = models.FloatField(default=0)