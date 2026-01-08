from django.db import models
from django.contrib.auth.models import User

class HealthProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    height = models.FloatField(help_text="Height in meters")
    weight = models.FloatField(help_text="Weight in kg")

    def bmi(self):
        return round(self.weight / (self.height ** 2), 2)

    def bmi_category(self):
        bmi = self.bmi()
        if bmi < 18.5:
            return "Underweight"
        elif bmi < 25:
            return "Normal"
        elif bmi < 30:
            return "Overweight"
        return "Obese"


class FitnessRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    steps = models.IntegerField(default=0)
    distance_km = models.FloatField(default=0)
    calories = models.FloatField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.date}"

