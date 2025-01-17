from django.http import JsonResponse,HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests, zipfile, io, csv
from .models import Bhavcopy
from django.core import serializers
from django.core.paginator import Paginator

@csrf_exempt
def submitdate(request): #Togetdate
    if request.method == 'POST':
            #Bhavcopy.objects.all().delete()
            data = json.loads(request.body)
            input_date = data.get('date')
            if input_date:
                 return JsonResponse({'message' : 'Got the date'})

            else:
                return JsonResponse({'message': 'Please Enter The Date Field'}, status=401)
            
    else:
        return JsonResponse({'message': 'Invalid Request Type'}, status=400)


def downloadfile(date): #Todownloadfile
     url = f"https://www.bseindia.com/download/BhavCopy/Equity/EQ{date}_CSV.ZIP"
     try:
        response = requests.get(url)
        with zipfile.ZipFile(io.BytesIO(response.content)) as f:
            f.extractall()
            copy=f"EQ{date}.CSV"
            with open(copy,'r') as file:
                reader=csv.reader(file)
                next(reader)
                for row in reader:
                        Bhavcopy.objects.create(
                        code=row[0], name=row[1], open=row[4], 
                        high=row[5], low=row[6], close=row[7])
        return f"Bhavcopy for {date} successfully downloaded and stored." 
     except Exception as e:
        return f"An error occurred: {e}"   
     
@csrf_exempt 
def crud(request): #Togetdatadisplayed
    if request.method == 'GET':
        items = Bhavcopy.objects.all()
        page_number = request.GET.get('page')
        page_size = request.GET.get('pageSize') 
        paginator = Paginator(items, page_size)
        try:
            paginated_items = paginator.page(page_number)
        except:
            return JsonResponse({"error": "Invalid page number"}, status=400)

        data = serializers.serialize("json", paginated_items.object_list)
        return JsonResponse(json.loads(data), safe=False)
    
    if request.method == 'PATCH':
            data = json.loads(request.body)
            id=data.get('pk')
            field=data['fields']
            Bhavcopy.objects.filter(pk=id).update(**field)
            return JsonResponse({'Message' : 'Updated successfully'}, status=200)
            
    if request.method == 'DELETE':
            data = json.loads(request.body)
            id=data.get('pk')
            print(id)
            Bhavcopy.objects.filter(pk=id).delete()
            return JsonResponse({'Message' : 'Deleted successfully'}, status=200)
            
@csrf_exempt          
def search(request):
    if request.method == 'GET':
        user_code=request.GET.get('code')
        user_name=request.GET.get('name')

        if user_code :
            newrecord=Bhavcopy.objects.filter(code=user_code)

        elif user_name:
            newrecord=Bhavcopy.objects.filter(name=user_name)
        
        else :
            return JsonResponse({'Message' : 'Please enter the value'} , status=401)
        
        data = serializers.serialize("json", newrecord)
        return JsonResponse(json.loads(data),safe=False)
    
    else :
         return JsonResponse({ 'Message' : 'Invalid Request'}, status = 400)


def total(request):
    if request.method == 'GET':
        data=Bhavcopy.objects.all().count()
        return JsonResponse({'count': data})
     

