const movies=document.getElementById("listmovies")
const inputsearch=document.getElementById("inputsearch")
const row = movies.getElementsByTagName("tr");
let myarr ,state
let xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function(){
    if(this.readyState==4 && this.status ==200)
    {
        myarr=JSON.parse(this.responseText)
        console.log(myarr);
        state={
            'queryset': JSON.parse(this.responseText),
            'page':1,
            'rows':2
        }
        
        
    }
}
xmlhttp.open("GET",'movies.json',true)
xmlhttp.send();

window.addEventListener('load', function() {
    createtr()
});

// function for pagination
function pagination(queryset,page,rows)
{
    let start=(page-1)*rows
    let end =start+rows
    let data= queryset.slice(start, end)
    let pages=Math.ceil(queryset.length/rows)
    return{
        'queryset':data,
        'pages':pages
    }
}
// function for add button
function pagebuttons(pages) {
    let pagination_numbers=document.getElementById("pagination-numbers")
    pagination_numbers.innerHTML=""
    for (let i = 1; i <= pages; i++) {
        pagination_numbers.innerHTML +=`<li class="page-item"><a class="page-link" >${i}</a></li>`
    }
    let btn_pagination=pagination_numbers.querySelectorAll('.page-link')
    for (let i = 0; i < btn_pagination.length; i++) {
        btn_pagination[i].addEventListener("click", function(){
            state.page=Number(btn_pagination[i].innerText)
            createtr()
        });
    }
}
// function for Create rows 
function createtr()
{
    let arra=pagination(state.queryset,state.page,state.rows)
    let mylist=arra.queryset
    let output="";
    for (let i = 0; i < mylist.length; i++) {
        let festivals="";
        let acteurs="";
        for (let j = 0; j < mylist[i].Festivals.length; j++) {
            festivals+=`
            <ul>
            <li>${(mylist[i].Festivals)[j]}</li>
            </ul>`
        }
        for (let k = 0; k < mylist[i].Acteurs.length; k++) {
            acteurs+=`
            <ul>
            <li>${(mylist[i].Acteurs)[k].nom} ${(mylist[i].Acteurs)[k].prénom}  ${(mylist[i].Acteurs)[k].nationalité} </li>
            </ul>`
        }
        output += `<tr>
                <td><img src="${mylist[i].Poster}" alt="movie" width="100px" height="100px"></td>
                <td>${mylist[i].titre}</td>
                <td>${mylist[i].réalisateur}</td>
                <td>${mylist[i].durée}</td>
                <td >${mylist[i].production}</td>
                <td>${festivals}</td>
                <td>${acteurs}</td>
      </tr>`
    }
    movies.innerHTML=output
    pagebuttons(arra.pages)
}
// search
inputsearch.addEventListener("input", function(){
    console.log(inputsearch.value);
    for (let i = 0; i < row.length; i++) {
        let cell = row[i].getElementsByTagName("td")[1];
        console.log(cell.innerText.toUpperCase().indexOf(inputsearch.value.toUpperCase()));
        cell.innerText.toUpperCase().indexOf(inputsearch.value.toUpperCase()) > -1 ? row[i].style.display = "": row[i].style.display = "none"
    }
});
// sort table byclick in head
const thead=document.getElementsByTagName("th");
for (let i = 1; i < 5; i++) {
    thead[i].addEventListener("click", function(){ 
        let rows =[...movies.rows];
        movies.innerHTML=''
        let x, y ,direction
        let span=thead[i].querySelector("span")
        if((span.innerHTML==`<i class="fa-solid fa-sort-down"></i>`) ||span.innerHTML=='')
        {
            span.innerHTML=''
            span.innerHTML=`<i class="fa-solid fa-sort-up"></i>`
            rows.sort(function(a, b)
            {
                (i==3 || i==4) ?( x=Number(a.getElementsByTagName("td")[i].innerHTML), y=Number(b.getElementsByTagName("td")[i].innerHTML)) :(x=a.getElementsByTagName("td")[i].innerHTML.toUpperCase() ,y=b.getElementsByTagName("td")[i].innerHTML.toUpperCase())
                console.log(direction);
                return x > y ? -1 : 1
            });
        }
        else if(span.innerHTML==`<i class="fa-solid fa-sort-up"></i>`)
        {
            span.innerHTML=''
            span.innerHTML=`<i class="fa-solid fa-sort-down"></i>`
            rows.sort(function(a, b)
            {
                (i==3 || i==4) ?( x=Number(a.getElementsByTagName("td")[i].innerHTML), y=Number(b.getElementsByTagName("td")[i].innerHTML)) :(x=a.getElementsByTagName("td")[i].innerHTML.toUpperCase() ,y=b.getElementsByTagName("td")[i].innerHTML.toUpperCase())
                console.log(direction);
                return x < y ? -1 : 1
            });
        }

        rows.map((row)=>movies.appendChild(row))
    });

    
}
