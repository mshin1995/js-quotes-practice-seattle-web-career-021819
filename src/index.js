const BASE_URL = 'http://localhost:3000/quotes'
const ul = document.getElementById('quote-list')
const form = document.getElementById('new-quote-form')

form.addEventListener('submit', (ev) => {
  ev.preventDefault()
  newQuote(ev.target[0].value, ev.target[1].value)
})

function getQuotes() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(quotes => {
      renderQuotes(quotes)
  })
}

function renderQuotes(quotes) {
  quotes.forEach(quote => {
    ul.appendChild(createQuote(quote))
  })
}

function newQuote(q, a) {
  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "quote": q,
      "author": a,
      "likes": 0
    })
  })
    .then(res => res.json())
    .then(quote => {
      ul.appendChild(createQuote(quote))
    })
}

function addLike(quote) {
  fetch(BASE_URL + '/' + quote.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "likes": quote.likes += 1
    })
  })
    .then(res => res.json())
    .then(quote => {
      renderNewLikes(quote)
  })
}

function deleteQuote(quote) {
  fetch(BASE_URL + '/' + quote.id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  clearQuote(quote)
}

function clearQuote(quote) {
  li = document.getElementById(quote.id)
  li.remove()
}

function renderNewLikes(quote) {
  span = document.getElementById('likes' + quote.id)
  span.textContent = quote.likes
}

function createQuote(data) {
  li = document.createElement('li')
  li.classList.add('quote-card')
  li.setAttribute('id', data.id)

  blockquote = document.createElement('blockquote')
  blockquote.classList.add('blockquote')

  p = document.createElement('p')
  p.classList.add('mb-0')
  p.textContent = data.quote

  footer = document.createElement('footer')
  footer.classList.add('blockquote-footer')
  footer.textContent = data.author

  br = document.createElement('br')

  likeButton = document.createElement('button')
  likeButton.classList.add('btn-success')
  likeButton.textContent = 'Likes: '
  likeButton.addEventListener('click', () =>{
    addLike(data)
  })

  span = document.createElement('span')
  span.textContent = data.likes
  span.setAttribute('id', 'likes' + data.id)

  deleteButton = document.createElement('button')
  deleteButton.classList.add('btn-danger')
  deleteButton.textContent = 'Delete'
  deleteButton.addEventListener('click', (ev) =>{
    ev.preventDefault()
    deleteQuote(data)
  })

  likeButton.appendChild(span)
  blockquote.append(p, footer, br, likeButton, deleteButton)
  li.appendChild(blockquote)

  return li
}

getQuotes()
