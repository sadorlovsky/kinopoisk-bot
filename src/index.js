import TelegramBot from 'node-telegram-bot-api'
import fetch from 'node-fetch'

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
})

function search (query) {
  const keywords = query.split(' ').filter(e => e.length > 0).join(',')
  const params = encodeURIComponent(keywords)
  return fetch(`http://api.kinopoisk.cf/searchFilms?keyword=${params}`)
    .then(res => res.json())
    .then(json => json.searchFilms)
    .then(movies => movies.map(movie => {
      return {
        id: movie.id,
        type: 'article',
        title: `${movie.nameRU} (${movie.year})`,
        description: movie.description,
        thumb_url: `http://st.kp.yandex.net/images/${movie.posterURL}`,
        message_text: `http://www.kinopoisk.ru/film/${movie.id}/`,
        parse_mode: 'Markdown'
      }
    }))
}

bot.on('inline_query', query => {
  search(query.query)
    .then(results => bot.answerInlineQuery(query.id, results))
    .catch(err => console.log(err))
})
