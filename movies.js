const movies=document.getElementById("listmovies")
const input_search=document.getElementById("inputsearch")
const btn_search=document.getElementById("btn-search")
const row = movies.getElementsByTagName("tr");
const thead=document.getElementsByTagName("th");
let state
let arrow=[]
let xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function(){
    if(this.readyState==4 && this.status ==200)
    {
        state={
            'queryset': JSON.parse(this.responseText),
            'page':1,
            'rows':2
        }
    }
}
xmlhttp.open("GET",'movies.json',true)
xmlhttp.send();

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
    let arra=pagination(state.queryset,state.page,state.rows)
    let pagination_numbers=document.getElementById("pagination-numbers")
    pagination_numbers.innerHTML=""
    for (let i = 1; i <= pages; i++) {
        pagination_numbers.innerHTML +=`<li class="page-item bg-danger"><a class="page-link text-black" >${i}</a></li>`
    }
    let btn_pagination=pagination_numbers.querySelectorAll('.page-item')
    for (let i = 0; i < btn_pagination.length; i++) {
        btn_pagination[i].addEventListener("click", function(){
            input_search.value=""
            state.page=Number(btn_pagination[i].innerText)
            createtr(arra.queryset)
            pagebuttons(arra.pages)
        });
    }
}
// function for Create rows 
function createtr(mylist)
{
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
}
window.addEventListener('load', function() {
    let arra=pagination(state.queryset,state.page,state.rows)
    createtr(arra.queryset)
    pagebuttons(arra.pages)

});
// search
btn_search.addEventListener("click", function(){
    arrow.pop()
    let check=true;
    let array=state.queryset
    for (let i = 0; i < array.length; i++) {
        if(input_search.value=="")
        {
            console.log("dkhel");
            let small= document.getElementById("error")
            console.log(small);
            small.innerHTML="champ obligatoir"

        }
        else if (array[i].titre.toUpperCase().indexOf(input_search.value.toUpperCase()) < 0) {
          movies.innerHTML = `<tr> NOT FOUND IT</tr>`;
        } else if (array[i].titre.toUpperCase().indexOf(input_search.value.toUpperCase()) > -1) {
            check=true
          movies.innerHTML = "";
          arrow.push(array[i]);
          console.log(arrow);
          createtr(arrow);
        }
    }

   
});
// sort table byclick in head
for (let i = 1; i < 5; i++) {
    thead[i].addEventListener("click", function(){ 
        let rows =[...movies.rows];
        movies.innerHTML=''
        let x, y 
        let span=thead[i].querySelector("span")
        if((span.innerHTML==`<i class="fa-solid fa-sort-down"></i>`) ||span.innerHTML=='')
        {
            span.innerHTML=''
            span.innerHTML=`<i class="fa-solid fa-sort-up"></i>`
            rows.sort(function(a, b)
            {
                (i==3 || i==4) ?( x=Number(a.getElementsByTagName("td")[i].innerHTML), y=Number(b.getElementsByTagName("td")[i].innerHTML)) :(x=a.getElementsByTagName("td")[i].innerHTML.toUpperCase() ,y=b.getElementsByTagName("td")[i].innerHTML.toUpperCase())
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
                return x < y ? -1 : 1
            });
        }

        rows.map((row)=>movies.appendChild(row))
    });

    
}
