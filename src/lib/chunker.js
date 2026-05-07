export function chunkTextToCards(text) {
  if (!text) return [];

  // Remove excessive whitespace but keep paragraph breaks
  const normalizedText = text.replace(/\n\s*\n/g, '\n\n').trim();
  
  // Split by double newline (paragraphs)
  const paragraphs = normalizedText.split('\n\n').filter(p => p.trim().length > 0);
  
  const cards = [];
  let currentCardText = "";
  let cardIndex = 1;
  const MAX_CARD_LENGTH = 450; // Target max chars per card

  for (const p of paragraphs) {
    const cleanP = p.replace(/\s+/g, ' ').trim();
    
    // If adding this paragraph exceeds the limit and we already have some text,
    // push the current card and start a new one.
    if (currentCardText.length + cleanP.length > MAX_CARD_LENGTH && currentCardText.length > 0) {
      cards.push(createCardData(currentCardText, cardIndex++));
      currentCardText = "";
    }
    
    // If a single paragraph is still too huge, split by sentences.
    if (cleanP.length > MAX_CARD_LENGTH) {
      // Split by sentences roughly using regex for punctuation followed by space
      const sentences = cleanP.match(/[^.!?]+[.!?]+/g) || [cleanP];
      
      for (const sentence of sentences) {
        const s = sentence.trim();
        if (currentCardText.length + s.length > MAX_CARD_LENGTH && currentCardText.length > 0) {
          cards.push(createCardData(currentCardText, cardIndex++));
          currentCardText = "";
        }
        currentCardText += (currentCardText ? " " : "") + s;
      }
    } else {
      currentCardText += (currentCardText ? "\n\n" : "") + cleanP;
    }
  }
  
  if (currentCardText.trim().length > 0) {
    cards.push(createCardData(currentCardText, cardIndex));
  }
  
  return cards;
}

function createCardData(text, index) {
  // Generate a very basic title or theme based on the first few words if needed
  const words = text.split(' ');
  const titlePreview = words.slice(0, 4).join(' ') + '...';
  
  return {
    id: `card-${Date.now()}-${index}`,
    title: `Section ${index}`,
    content: text,
  };
}
