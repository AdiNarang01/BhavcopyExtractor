from django.urls import path
from . import views

urlpatterns = [
    path('submit-date/', views.submitdate),
    path('get-data/',views.crud),
    path('update-data/',views.crud),
    path('delete-data/',views.crud),
    path('search/',views.search),
    path('total/',views.total),

]
