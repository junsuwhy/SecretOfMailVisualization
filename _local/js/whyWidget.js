//把Object變成array
arrFromObj=function(myObj){
	arr=new Array();

	for (key in myObj) {
		arr.push(myObj[key]);
	};
	return arr;
}

//傳回下個月一號的date物件
nextMonthFirstDay=function(strDate){
	date=new Date(strDate);
	year=date.getYear;
	month=date.getMonth;
	if(month==11){
		year+=1;
		month=1;
	}
	return new Date(year.subStr(1)+"/"+month+"/1");
}