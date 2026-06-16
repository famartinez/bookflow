const quotes = [
  { text: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The single biggest problem in communication is the illusion that it has taken place.", author: "George Bernard Shaw" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Make every detail perfect and limit the number of details to perfect.", author: "Jack Dorsey" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't find customers for your products, find products for your customers.", author: "Seth Godin" },
  { text: "Chase the vision, not the money; the money will end up following you.", author: "Tony Hsieh" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
]

const start = new Date(new Date().getFullYear(), 0, 0)
const dayOfYear = Math.floor((Date.now() - start) / 86400000)

export default quotes[dayOfYear % quotes.length]
