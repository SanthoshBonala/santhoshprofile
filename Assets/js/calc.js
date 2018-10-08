function vc(){
    var na=document.getElementById("Name").value.toLowerCase();
    var lastna=document.getElementById("Lastname").value.toLowerCase();
   var k= vfirst(na);
   var l= vlast(lastna);
    document.getElementById("comment").innerHTML="vowel count in first name:"+k+"<br>vowel count in last name:"+l+"<br>"
    +"Total number of vowels in first and lastname:"+(k+l);
    document.getElementById("reset").innerHTML="Count More";
    $("strong").html("Result are displayed below").css("color","black");
    return false;
    }
 function vfirst(na){
        var k=0,l=0;
        if((na.length === 0 )|| na === null ||/[\d\s@!#$%^&*().,":;{}=+-_]/.test(na)){
          alert("First Name should not contain special characters or numbers or empty");
          throw Error('The given argument is not a valid name');}
          else{
        for(var i=0;i<na.length;i++){
            if(na[i]=='a'||na[i]=='e'||na[i]=='i'||na[i]=='o'||na[i]=='u'){
        k++;
            }
        }
    }
    return k;
}
function vlast(lastna){
    var k=0,l=0;
    if((lastna.length === 0 )|| lastna === null ||/[\d\s@!#$%^&*().,":;{}=+-_]/.test(lastna)){
      alert("Last Name should not contain special characters or numbers or empty");
      throw Error('The given argument is not a valid name');}
      else{
    for(var i=0;i<lastna.length;i++){
        if(lastna[i]=='a'||lastna[i]=='e'||lastna[i]=='i'||lastna[i]=='o'||lastna[i]=='u'){
    l++;
        }
    }
}
    return l;

}