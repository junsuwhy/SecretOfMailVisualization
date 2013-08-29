<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>email的小秘密</title>
<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>
<script src="myvisualizer.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
</head>
<body>
  <div>
    <select id='selector'>
      <option value="cmeo.h" selected="selected">cmeo.h</option>
      <option value="cmeo.w">cmeo.w</option>
      <option value="cmet.h">cmet.h</option>
      <option value="cmet.w">cmet.w</option>
    </select>
    <input type="checkbox" id="sortit">排序</input>
  </div>
<div id='svg-container'>


</div>

<div id='result'>

</div>
<script>
w=800;
h=600;

//函式:把object轉成array
arrFromObj=function(myObj){
  arr=[]
  $.each(myObj, function(i,n) {
    arr.push(n);});
  return arr;
}

strDataset="";
  $(document).ready(function(){
    //Ajax load資料
      xmlhttp=new XMLHttpRequest();
      xmlhttp.open("GET","http://nettuesday.tw/sites/nettuesday.tw/ttt.php",true);
      xmlhttp.send();
  
      xmlhttp.onreadystatechange=function(e){
        if(xmlhttp.readyState==4){
          strDataset=xmlhttp.responseText;
          objDataset=$.parseJSON(strDataset);
          visualize(objDataset,"cmeo.h");
          //$('#result').html(strDataset);

          //換別種type
          $('#selector').change(function(){
            visualize(objDataset,$('#selector').val());
             $('#sortit').removeAttr("checked");
          });

          //排序
          $('#sortit').change(function(){
            showsortit($('#sortit').is(":checked"));
          });

        }
      }
  });



</script>
</body>
</html>
