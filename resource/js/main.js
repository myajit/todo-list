'use strick'

let renderCurrentTime = setInterval(()=>{
    let now = new Date()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()

    hour = hour < 10 ? "0" + hour:hour
    minutes = minutes < 10 ? "0" + minutes:minutes
    seconds = seconds < 10 ? "0" + seconds:seconds
    document.querySelector('.time').innerHTML 
    = hour + ' : ' + minutes + ' : ' + seconds
},1000)

let registSchedule = (event) => {
    event.preventDefault()
    let preveTodo = localStorage.getItem('todo')
    let input = document.querySelector('.inp-list').value

    if(input == "") {
        alert('스케쥴을 입력하세요.')
        return
    }

    let todoList = []
    // let page = 1

    if(preveTodo){
        todoList = JSON.parse(preveTodo)
        let idx = Number(localStorage.getItem('lastIdx')) +1
        localStorage.setItem('lastIdx', idx)
        todoList.unshift({work:input, idx:idx});
    }
     else {
         localStorage.setItem('lastIdx',0)
        todoList.unshift({work:input, idx:0});
    }

    localStorage.setItem('todo', JSON.stringify(todoList))
    renderSchedule(todoList.slice(0,8))
}

let removeSchedule = event => {
    let curPage = Number(document.querySelector('.curPage').textContent)
    let todoList = JSON.parse(localStorage.getItem('todo'))
    let removedList = todoList.filter(e => {
        return event.target.dataset.idx != e.idx
    })

    localStorage.setItem('todo',JSON.stringify(removedList))

    let end = curPage * 8 
    let begin = end - 8
    renderSchedule(removedList.slice(begin,end))
}


let renderSchedule = (todoList) => {
    document.querySelectorAll('.todo-list-wrap p').forEach(e => {e.remove()})

    todoList.forEach(schedule => {
        let workp = document.createElement('p')
        workp.innerHTML = schedule.work + `<span class="del" data-idx="${schedule.idx}"><em>x<em></span>`
        document.querySelector('.todo-list-wrap').append(workp) 

        document.querySelectorAll('.todo-list-wrap .del').forEach(e => {
            e.addEventListener('click',removeSchedule)
        })
    })

    

    document.querySelector('.inp-list').value = ""
}

let renderPagination = (event) => {
    let dir = Number(event.target.dataset.dir)
    let curPage = Number(document.querySelector('.curPage').textContent)
    let lastPage;
    let renderPage = curPage + dir
    let  todoList = localStorage.getItem('todo')

    if(todoList) {
        todoList = JSON.parse(todoList)
        let todoCnt = todoList.length
        lastPage = Math.ceil(todoCnt/8)
    }

    if(renderPage > lastPage) {
        alert('마지막 페이지 입니다.')
        return
    }

    if(renderPage < 1) {
        alert('첫 페이지 입니다.')
        return
    }

    let end = renderPage * 8 
    let begin = end - 8

    renderSchedule(todoList.slice(begin,end))
    document.querySelector('.curPage').textContent = renderPage
}

let convertMainDiv = (username) => {
    document.querySelector('.title').innerHTML = username
    document.querySelector('.inp-todo').placeholder = 'Enter ur schedule'
    document.querySelector('.inp-todo').value = "";
    document.querySelector('.inp-todo').setAttribute('class',"inp-list")
    document.querySelector('.frm-username').setAttribute('class',"frm-todo")
    document.querySelector('.todo-list-wrap').style.display = "flex"
    
    // document.querySelector('.frm-todo').removeEventListener('submit',renderUser)
    document.querySelector('.frm-todo').addEventListener('submit',registSchedule)
    document.querySelector('#leftArrow').addEventListener('click',renderPagination)
    document.querySelector('#rightArrow').addEventListener('click',renderPagination)
}

(() => {
 let username = localStorage.getItem('username');
 let todoList = localStorage.getItem('todo')
 
 if(username) {
    convertMainDiv(username)

    if(todoList){
        todoList = JSON.parse(todoList)
        renderSchedule(todoList.slice(0,8))
    }
 } else {
        document.querySelector('.frm-username').addEventListener('submit', () => {
        let input = document.querySelector('.inp-todo').value
        localStorage.setItem('username',input)
        convertMainDiv(input)
    })
 }
})();
