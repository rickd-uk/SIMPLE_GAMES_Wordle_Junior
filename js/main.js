import { wordBankCommon, wordBankFull } from '../fiveLetterWords.js'
;(function () {
	let guessedWords = [[]]
	let avaliableSpace = 1
	let word = ''
	let guessedWordCount = 0
	let currentWordIndex = 0
	let keyPressed
	const alpha = `qwertyuiopasdfghjklzxcvbnm`

	// const words = ['times', 'socks', 'chair', 'table', 'cloud']
	// let currentWord = words[currentWordIndex]

	document.addEventListener('DOMContentLoaded', () => {
		// initLocalStorage()
		createSquares()
		handleKeys()
		handleKeyboard()
		startGame()

		function getNewWord() {
			const selectedWordNo = Math.floor(Math.random() * wordBankCommon.length)
			word = wordBankCommon[selectedWordNo].toLowerCase()
			console.log(word)
		}

		// function initLocalStorage() {
		// 	const storedCurrentWordIndex = window.localStorage.getItem('currentWordIndex')
		// 	if (!storedCurrentWordIndex) {
		// 		window.localStorage.setItem('currentWordIndex', currentWordIndex)
		// 	} else {
		// 		currentWordIndex = Number(storedCurrentWordIndex)
		// 		currentWord = words[currentWordIndex]
		// 	}
		// }

		function handleKeyboard() {
			window.addEventListener('keydown', function (event) {
				// console.log('HANDLE KEYBOARD')
				keyPressed = event.key

				if (keyPressed === 'Enter') {
					handleSubmitWord()
					return
				}
				if (keyPressed === 'Backspace') {
					handleDeleteLetter()
					return
				}

				alpha.split('').some((a) => {
					if (keyPressed.includes(a) && keyPressed.length === 1) {
						updateGuessedWords(keyPressed)
					}
				})
			})
		}

		function reset() {
			Array.from(document.querySelectorAll('.square.animate__flipInX')).forEach(function (el) {
				el.classList.remove('animate__flipInX')
				el.removeAttribute('style')
				el.textContent = ''
			})
			guessedWords = [[]]
			avaliableSpace = 1
			guessedWordCount = 0

			Array.from(document.querySelectorAll('.keyboard-row > button')).forEach(function (el) {
				el.removeAttribute('style')
			})
		}

		function updateWordIndex() {
			window.localStorage.setItem('currentWordIndex', currentWordIndex + 1)
		}

		function startGame() {
			reset()
			getNewWord()
			updateWordIndex()
		}

		function handleKeys() {
			const keys = document.querySelectorAll('.keyboard-row button')
			// console.log('HANDLE KEYS')

			for (let i = 0; i < keys.length; i++) {
				keys[i].onclick = ({ target }) => {
					const letter = target.getAttribute('data-key')

					if (letter === 'enter') {
						handleSubmitWord()
						return
					}
					if (letter === 'delete') {
						handleDeleteLetter()
						return
					}
					updateGuessedWords(letter)
				}
			}
		}

		function getCurrentWordArr() {
			const numGuessedWords = guessedWords.length
			return guessedWords[numGuessedWords - 1]
		}

		function updateGuessedWords(letter) {
			const currentWordArr = getCurrentWordArr()

			if (currentWordArr && currentWordArr.length < 5) {
				currentWordArr.push(letter)

				console.log('AVALIABLE SPACE IS  ', avaliableSpace)
				const avaliableSpaceEl = document.getElementById(String(avaliableSpace))
				avaliableSpace = avaliableSpace + 1

				avaliableSpaceEl.textContent = letter
			}
		}
		function changeKeyColors(letter, tileColor) {
			const key = document.querySelector(`[data-key=${letter}]`)
			key.style = `background-color:${tileColor}; border-color:${tileColor}`
		}

		function getTileColor(letter, index) {
			const isCorrectLetter = word.includes(letter)
			if (!isCorrectLetter) {
				return 'rgb(58,58,60)' // gray default
			}
			const letterInPos = word.charAt(index)
			const isCorrectPos = letter === letterInPos

			if (isCorrectPos) {
				return 'rgb(83,141,78)' // green
				// TODO:
			} else {
				return 'rgb(181, 159, 59)' // orange
			}
		}

		function showBriefMessage(message) {
			const modal = document.getElementById('messageModal')
			document.getElementById('modal-message').innerText = message

			modal.style.display = 'block'
			setTimeout(() => {
				modal.style.display = 'none'
			}, 1500)
		}

		// function validWordNaive(playerWord) {
		// 	let found = false
		// 	let i = 0
		// 	while (!found && i < wordBankFull.length) {
		// 		let candidateWord = wordBankFull[i].charAt(0).toLowerCase() + wordBankFull[i].slice(1)
		// 		//console.log(candidateWord.charCodeAt(0))
		// 		console.log(i)
		// 		if (candidateWord === playerWord) {
		// 			return true
		// 		} else if (candidateWord[0] > playerWord[0]) {
		// 			return false
		// 		}
		// 		i++
		// 	}
		// 	return false
		// }

		// Using Binary Search
		function validWord(playerWord, start, end) {
			if (start > end) return false

			let mid = Math.floor((start + end) / 2)

			if (wordBankFull[mid] === playerWord) return true

			if (wordBankFull[mid] > playerWord) return validWord(playerWord, start, mid - 1)
			else return validWord(playerWord, mid + 1, end)
		}

		function handleSubmitWord() {
			const currentWordArr = getCurrentWordArr()
			if (currentWordArr.length === 0) {
				showBriefMessage(`Come on! You must type something`)
				return
			}
			if (currentWordArr.length !== 5) {
				showBriefMessage(`The word must have 5 letters`)
				return
			}

			const currentWord = currentWordArr.join('')

			let valid = validWord(currentWord, 0, wordBankFull.length)
			console.log(valid)

			if (valid) {
				const firstLetterId = guessedWordCount * 5 + 1

				const interval = 200
				currentWordArr.forEach((letter, index) => {
					setTimeout(() => {
						const tileColor = getTileColor(letter, index)

						const letterId = firstLetterId + index
						console.log('letterId ', letterId)
						const letterEl = document.getElementById(letterId)
						letterEl.classList.add('animate__flipInX')
						letterEl.style = `background-color:${tileColor}; border-color:${tileColor}`
						changeKeyColors(letter, tileColor)
					}, interval * index)
				})
				guessedWordCount += 1
				guessedWords.push([])
			} else {
				showBriefMessage('This is not a word I know!')
			}

			if (currentWord === word) {
				setTimeout(() => {
					showBriefMessage(`WELL DONE!!`)
					startGame()
				}, 2000)
			} else if (guessedWordCount === 6) {
				setTimeout(() => {
					showBriefMessage(`No more guesses. The word is ${word}`)
					startGame()
				}, 2000)
			}
		}

		function handleDeleteLetter() {
			const currentWordArr = getCurrentWordArr()
			const removedLetter = currentWordArr.pop()

			guessedWords[guessedWords.length - 1] = currentWordArr

			console.log('currentWordArr.length ', currentWordArr.length)

			console.log('')

			if (avaliableSpace % 5 !== 1 || currentWordArr.length !== 0) {
				const lastLetterEl = document.getElementById(String(avaliableSpace) - 1)
				lastLetterEl.textContent = ''
				avaliableSpace = avaliableSpace - 1
			}
		}

		function createSquares() {
			const gameBoard = document.getElementById('board')

			for (let index = 0; index < 30; index++) {
				let square = document.createElement('div')
				square.classList.add('square')
				square.setAttribute('id', index + 1)
				gameBoard.appendChild(square)
			}
		}
	})
})()
