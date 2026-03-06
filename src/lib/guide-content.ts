interface GuideSection {
  heading: string
  content: string[]
}

interface GuideContent {
  title: string
  description: string
  intro: string
  sections: GuideSection[]
  faq: { question: string; answer: string }[]
}

export const GUIDE_CONTENT: Record<string, GuideContent> = {
  pokemon: {
    title: 'How to Start Collecting Pokemon Cards',
    description: 'A complete beginner\'s guide to collecting Pokemon TCG cards. Learn what to buy, how to evaluate cards, and where to find the best deals.',
    intro: 'The Pokemon Trading Card Game is one of the most accessible and rewarding collectible card games to get into. Whether you want to play competitively, collect beautiful artwork, or invest in valuable cards, this guide covers everything you need to know as a beginner.',
    sections: [
      {
        heading: 'Getting Started: What to Buy First',
        content: [
          'If you want to learn to play, start with a Battle Academy box or two theme decks. These include everything two players need to learn the game, including rulebooks and playmats. For collectors, an Elite Trainer Box (ETB) from the latest set is the best starting product — it includes 9 booster packs, card sleeves, dice, and a storage box.',
          'Avoid buying loose booster packs at inflated prices from convenience stores or gas stations. Buy sealed products from reputable retailers like local game stores, Target, Walmart, or online from the Pokemon Center. Sealed products guarantee authentic cards and fair pricing.',
        ],
      },
      {
        heading: 'Understanding Card Rarities',
        content: [
          'Pokemon cards use symbols in the bottom-right corner to indicate rarity. A circle (●) means Common, a diamond (◆) means Uncommon, and a star (★) means Rare. Above these base rarities, modern sets include Holo Rare (holographic artwork), Ultra Rare (ex and other powerful cards), Illustration Rare (extended artwork), Special Art Rare (full art with unique scenes), and Hyper Rare (gold or rainbow variants).',
          'The rarest and most valuable cards in modern sets are typically Special Art Rares (SAR) and Illustration Rares (IR). These feature unique artwork by guest illustrators and can be worth $50-$200+ depending on the Pokemon featured. Classic holographic rares from vintage sets (1999-2003) are also highly collectible, especially in graded condition.',
        ],
      },
      {
        heading: 'How to Evaluate Card Value',
        content: [
          'Card value is determined by rarity, condition, demand, and competitive viability. Use TCGplayer or Cardmarket to check current market prices before buying or selling. Prices fluctuate based on tournament results, set availability, and collector demand.',
          'For condition, the key factors are centering (how well the image is centered on the card), corners (sharp vs. worn), edges (clean vs. whitening), and surface (scratches, print lines). Cards in Near Mint condition command the highest prices. If you plan to get cards professionally graded, look for cards with excellent centering and no visible flaws.',
        ],
      },
      {
        heading: 'Building a Collection Strategy',
        content: [
          'Decide early whether you want to collect for fun, investment, or competitive play — this shapes your buying strategy. Collectors typically focus on completing sets, gathering artwork from favorite artists, or collecting specific Pokemon across all their card versions.',
          'For investment, focus on sealed products (booster boxes and ETBs tend to appreciate over time) and high-grade chase cards from popular sets. For competitive play, buying singles is far more cost-effective than opening packs. A tournament-ready deck can often be built for $30-$100 by purchasing individual cards.',
        ],
      },
      {
        heading: 'Storing and Protecting Your Cards',
        content: [
          'Proper storage is essential for maintaining card value. At minimum, keep valuable cards in penny sleeves inside toploaders. For your collection binder, use side-loading 9-pocket pages to prevent cards from sliding out. Store cards away from direct sunlight, humidity, and extreme temperatures.',
          'For high-value cards worth $50+, consider double-sleeving (penny sleeve inside a toploader or Card Saver) and storing in a cool, dry place. If you plan to get cards graded, handle them by the edges only and use clean, lint-free surfaces when examining them.',
        ],
      },
    ],
    faq: [
      { question: 'How much should I spend on Pokemon cards as a beginner?', answer: 'Start with $30-$50 for an Elite Trainer Box or two theme decks. This gives you enough cards to learn and enjoy without overcommitting. Set a monthly budget and stick to it — the hobby can get expensive quickly if you chase every new release.' },
      { question: 'Are Pokemon cards a good investment?', answer: 'Sealed products (booster boxes, ETBs) from popular sets have historically appreciated in value over 3-5 years. Individual cards are more volatile — chase cards from current sets may drop as supply increases, while vintage cards in high grades tend to hold or increase in value. Never invest more than you can afford to lose.' },
      { question: 'Where is the best place to buy Pokemon cards?', answer: 'For sealed products: local game stores, Pokemon Center online, Target, and Walmart offer retail pricing. For singles: TCGplayer, eBay (from reputable sellers), and local game stores. Avoid Amazon marketplace sellers for sealed products as counterfeit products are common.' },
    ],
  },
  mtg: {
    title: 'Magic: The Gathering Beginner\'s Guide',
    description: 'Learn how to start playing and collecting Magic: The Gathering. Covers formats, deck building, card evaluation, and where to play.',
    intro: 'Magic: The Gathering is the world\'s first and most strategically deep collectible card game. With over 30 years of history and thousands of unique cards, getting started can seem overwhelming — but it doesn\'t have to be. This guide breaks down everything a new player needs to know.',
    sections: [
      {
        heading: 'Choosing Your First Product',
        content: [
          'The best starting point for new players is a Starter Kit, which includes two ready-to-play decks and a learn-to-play guide. If you prefer digital, MTG Arena is free-to-play and offers an excellent interactive tutorial that teaches you the rules step by step.',
          'Once you understand the basics, Commander preconstructed decks are the most popular product for casual players. Each deck contains 100 unique cards built around a theme, ready to play in the most popular casual format. They offer excellent value and a social multiplayer experience.',
        ],
      },
      {
        heading: 'Understanding the Five Colors',
        content: [
          'Magic\'s identity revolves around five colors of mana, each with distinct strengths. White excels at small creatures, life gain, and board-wide effects. Blue focuses on card draw, counterspells, and tempo. Black offers powerful removal, hand disruption, and recurring creatures from the graveyard. Red delivers speed, direct damage, and aggressive creatures. Green provides the largest creatures, mana acceleration, and creature-based card advantage.',
          'Most decks use two or three colors to balance strengths and cover weaknesses. As a beginner, try a two-color combination to keep mana requirements manageable. Popular pairings include Red-White (aggressive), Blue-Black (control), and Green-Red (midrange creatures).',
        ],
      },
      {
        heading: 'Formats Explained',
        content: [
          'Standard uses only cards from the last 2-3 years of sets, making it the most accessible competitive format with a smaller card pool. Pioneer includes cards from 2012 onward, offering more variety. Modern goes back to 2003 and has a vast card pool with powerful strategies. Legacy and Vintage include nearly every card ever printed.',
          'Commander (EDH) is a 100-card singleton format designed for multiplayer games of 3-4 players. It\'s the most popular casual format and emphasizes fun, creativity, and social interaction over strict competition. Most local game stores host weekly Commander nights — this is where most new players find their community.',
        ],
      },
      {
        heading: 'Building Your First Deck',
        content: [
          'A standard constructed deck needs at least 60 cards. A solid starting framework is: 24 lands, 24 creatures, and 12 non-creature spells (instants, sorceries, enchantments). Focus your deck around one clear strategy — aggro (fast damage), midrange (value creatures), or control (answers and late-game power).',
          'For Commander, your 100-card deck must include your commander plus exactly 99 other cards, each unique (no duplicates except basic lands). Start with a preconstructed deck and upgrade gradually by swapping in cards that better support your commander\'s strategy.',
        ],
      },
      {
        heading: 'Where to Play',
        content: [
          'Local game stores (LGS) are the heart of the MTG community. Most stores host Friday Night Magic (FNM) events weekly, offering casual Standard, Draft, or Commander play. Use the Wizards of the Coast store locator to find shops near you.',
          'Online options include MTG Arena (free, Standard and Draft focused) and Magic Online (MTGO, paid, supports all formats). Arena is ideal for learning and practicing, while MTGO is preferred by competitive players who need access to older formats.',
        ],
      },
    ],
    faq: [
      { question: 'Is Magic: The Gathering expensive to play?', answer: 'It depends on the format. Commander preconstructed decks cost $40-$60 and are playable immediately. Competitive Standard decks range from $100-$400. Draft events cost $12-$18 per session. Budget options exist in every format — you don\'t need expensive cards to have fun.' },
      { question: 'What is the best MTG format for beginners?', answer: 'Commander is the best format for casual beginners — buy a preconstructed deck and find a playgroup at your local game store. For competitive beginners, Standard has the smallest card pool and is easiest to learn. MTG Arena is the best way to learn the rules for free.' },
      { question: 'How do I know which cards are valuable?', answer: 'Check prices on TCGplayer, Scryfall, or MTGGoldfish. Card value is driven by competitive demand, rarity, and collectibility. Mythic Rares, fetch lands, and format staples tend to hold value. Foil and alternate art versions of popular cards command premiums.' },
    ],
  },
  yugioh: {
    title: 'Yu-Gi-Oh! Beginner\'s Guide to Playing and Collecting',
    description: 'Everything you need to know to start playing and collecting Yu-Gi-Oh! cards. Covers deck building, summoning mechanics, and market tips.',
    intro: 'Yu-Gi-Oh! is one of the most fast-paced and combo-heavy trading card games in the world. With no resource system like mana or energy, the game rewards creativity, memorization, and precise sequencing. This guide helps new players navigate the game\'s depth without getting overwhelmed.',
    sections: [
      {
        heading: 'Your First Purchase',
        content: [
          'Start with a Structure Deck ($10-$12) — it\'s a pre-built 40-card deck ready to play. Many competitive players recommend buying three copies of the same Structure Deck, which gives you full playsets of the key cards and enough material to build a focused, consistent deck.',
          'Popular beginner-friendly Structure Decks include the Blue-Eyes, Dark Magician, Branded, and Labrynth decks. Check online reviews to see which current Structure Deck offers the best competitive potential for its price. Avoid random booster packs until you understand what cards your deck needs.',
        ],
      },
      {
        heading: 'Understanding Summoning Mechanics',
        content: [
          'Yu-Gi-Oh! has seven summoning methods, but don\'t let that intimidate you — you\'ll learn them gradually. Normal Summon is placing a Level 4 or lower monster from your hand (one per turn). Tribute Summon is sacrificing monsters you control to summon a Level 5+ monster.',
          'The Extra Deck summoning methods (Fusion, Synchro, Xyz, Link, Pendulum) each have specific requirements. Fusion combines listed materials with a fusion spell. Synchro requires a Tuner + non-Tuner whose levels add up correctly. Xyz overlays same-level monsters. Link uses a specific number of materials. Start with one or two mechanics and expand from there.',
        ],
      },
      {
        heading: 'Building a Competitive Deck',
        content: [
          'A Yu-Gi-Oh! deck should be exactly 40 cards for maximum consistency. Your deck needs three components: your main engine (archetype cards that execute your strategy), extenders (cards that help you continue combos), and disruption (hand traps and trap cards that interrupt your opponent).',
          'Essential staple hand traps for any deck include Ash Blossom & Joyous Spring, Effect Veiler, and Ghost Ogre & Snow Rabbit. These cards provide interaction on your opponent\'s turn and are used across virtually all competitive decks. Budget alternatives exist for most expensive staples.',
        ],
      },
      {
        heading: 'The Forbidden & Limited List',
        content: [
          'Unlike most TCGs, Yu-Gi-Oh! has no rotating format — every card ever printed is legal unless it appears on the Forbidden & Limited list. This list is updated quarterly by Konami and directly impacts which decks are viable.',
          'Forbidden cards (Banned) cannot be used at all. Limited cards allow only 1 copy. Semi-Limited allows 2 copies. When a card moves to the banlist, its price typically drops. When a card comes off the banlist, it often spikes. Staying aware of banlist trends helps with both deck building and card investment.',
        ],
      },
      {
        heading: 'Collecting and Card Value',
        content: [
          'Yu-Gi-Oh! card values are heavily driven by competitive demand. A card that tops a major tournament can double or triple in price overnight. Conversely, banlist hits can crater prices. For collectors, the rarest modern pulls are Starlight Rares (roughly 1 per 2 cases) and Quarter Century Secret Rares.',
          'Tins, special editions, and reprint sets like Maximum Gold and Ghosts from the Past offer significant value by reprinting expensive staples at lower rarities. If you need specific cards for your deck, wait for reprint announcements before buying at peak prices.',
        ],
      },
    ],
    faq: [
      { question: 'Is Yu-Gi-Oh! hard to learn?', answer: 'The basic rules are straightforward — summon monsters, attack, use spells and traps. The complexity comes from the thousands of card interactions and combo lines. Start with a simple deck (Structure Deck), learn one summoning mechanic at a time, and use online simulators like EDOPro to practice for free.' },
      { question: 'How much does a competitive Yu-Gi-Oh! deck cost?', answer: 'Budget competitive decks can be built for $50-$100 using Structure Deck cores and affordable staples. Top-tier meta decks typically cost $200-$500 depending on how many expensive staple hand traps and Extra Deck monsters you need. Prices drop significantly after reprint sets release.' },
      { question: 'Where can I play Yu-Gi-Oh?', answer: 'Local game stores host weekly Official Tournament Store (OTS) events. Online, EDOPro and Dueling Book are free simulators. Konami also runs Master Duel (free-to-play digital game) and Duel Links (mobile). For competitive play, look for Regional and YCS events through the Yu-Gi-Oh! event locator.' },
    ],
  },
  onepiece: {
    title: 'One Piece TCG Beginner\'s Guide',
    description: 'Get started with the One Piece Trading Card Game. Learn the rules, understand the DON!! system, and find out what to buy first.',
    intro: 'The One Piece Card Game from Bandai has taken the TCG world by storm since its 2022 launch. Combining accessible gameplay with gorgeous manga-quality artwork, it\'s an excellent entry point for both card game veterans and newcomers drawn in by the anime and manga. Here\'s how to get started.',
    sections: [
      {
        heading: 'What to Buy First',
        content: [
          'Start with a Starter Deck ($15-$20). Each Starter Deck includes a unique Leader card, a ready-to-play 50-card deck, a DON!! deck, and a playmat. Choose a Starter Deck featuring a character you like — every starter is balanced and competitive enough for casual play.',
          'Popular Starter Deck leaders include Monkey D. Luffy (Red, aggressive), Trafalgar Law (Blue/Purple, control), and Boa Hancock (Yellow, triggers). After learning the basics with a Starter Deck, you can upgrade with singles from booster sets to strengthen your strategy.',
        ],
      },
      {
        heading: 'How the Game Works',
        content: [
          'Each player selects a Leader card and builds a 50-card deck matching their Leader\'s color. You also have a separate 10-card DON!! deck that provides your resources. Each turn, you gain one DON!! from this deck (up to 10), which you use to play character and event cards or attach to characters for +1000 power each.',
          'The goal is to attack and reduce your opponent\'s Leader to zero life. When a Leader takes damage, the top card of their Life deck moves to their hand — giving them more options but bringing them closer to defeat. If a card drawn from Life has a Trigger effect, it activates immediately for free, providing a powerful comeback mechanic.',
        ],
      },
      {
        heading: 'Understanding Colors',
        content: [
          'The six colors define play styles: Red is aggressive with high-power attackers. Blue controls the tempo by bouncing cards to hand and reducing costs. Green ramps DON!! faster than normal. Purple manipulates costs and has powerful late-game effects. Black removes opposing characters with destruction effects. Yellow specializes in Life manipulation and trigger effects.',
          'Some Leaders are dual-color (like Blue/Purple or Red/Green), allowing you to use cards from both colors in your deck. Dual-color decks have more variety but require careful deck building to balance the two strategies.',
        ],
      },
      {
        heading: 'Collecting One Piece Cards',
        content: [
          'The most collectible cards are alternate art Leaders, manga art variants featuring iconic panels from the series, and Secret Rare character cards. These premium variants often feature artwork exclusive to the card game, making them unique collectibles even among One Piece merchandise.',
          'Japanese cards are typically cheaper than English versions due to larger print runs. Some collectors prefer the Japanese card quality and original text. If you only want to play casually, Japanese cards work fine. For competitive play at English-language events, you\'ll need the English versions.',
        ],
      },
    ],
    faq: [
      { question: 'Do I need to watch One Piece to enjoy the card game?', answer: 'Not at all. The gameplay stands on its own as a well-designed card game. However, fans of the anime and manga will appreciate the thematic connections, character abilities, and artwork that reference key moments from the series.' },
      { question: 'How much does it cost to build a competitive One Piece deck?', answer: 'A Starter Deck costs $15-$20 and is immediately playable. Upgrading to a competitive build typically costs $50-$150 in singles depending on the Leader and archetype. The game is relatively affordable compared to Pokemon and MTG.' },
      { question: 'Is the One Piece TCG growing or dying?', answer: 'The One Piece TCG is one of the fastest-growing card games as of 2025-2026. Tournament attendance is increasing, set releases are consistent, and the anime\'s continued popularity drives new player interest. Card values have been strong, especially for chase alternate art cards.' },
    ],
  },
  gundam: {
    title: 'Gundam Card Game Beginner\'s Guide',
    description: 'Get started with the Gundam Card Game. Learn the basics of gameplay, deck building, and collecting cards from the Gundam franchise.',
    intro: 'The Gundam Card Game brings the iconic mecha franchise to the tabletop with strategic card battles featuring mobile suits, pilots, and military forces from across the Gundam multiverse. Whether you\'re a longtime Gundam fan or a card game enthusiast looking for something new, this guide covers the essentials.',
    sections: [
      {
        heading: 'Getting Started',
        content: [
          'The best entry point is a Starter Set, which includes a pre-built deck themed around a specific Gundam series, a rulebook, and everything needed to play. Starter Sets are affordable and let you jump straight into gameplay while learning the rules.',
          'Choose a Starter Set featuring your favorite Gundam series — whether that\'s Universal Century classics like the original Mobile Suit Gundam, alternate universes like Wing or SEED, or modern series like The Witch from Mercury. Each set plays differently, so pick what appeals to you thematically.',
        ],
      },
      {
        heading: 'Core Gameplay Concepts',
        content: [
          'The game revolves around deploying Unit cards (mobile suits), assigning Character cards (pilots) to them, and using Command cards (tactical maneuvers) to gain advantages. Each card has a deployment cost, and managing your resources each turn is key to fielding the strongest possible forces.',
          'Pairing the right pilot with the right unit is central to strategy. Iconic combinations like Amuro Ray piloting the RX-78-2 Gundam unlock powerful synergy abilities. Building your deck around complementary units, pilots, and commands from the same color faction creates a cohesive strategy.',
        ],
      },
      {
        heading: 'Deck Building Basics',
        content: [
          'Decks are built around a color faction that determines which cards you can include. Each color emphasizes different strategies — some favor aggressive rushdown, others defensive positioning or support-based play.',
          'A balanced deck includes a mix of Unit cards at various cost levels (cheap units for early deployment, expensive powerhouses for late game), Character cards to enhance your key units, and Command cards for tactical flexibility. Start with the Starter Set and gradually swap in stronger cards as you learn what works.',
        ],
      },
      {
        heading: 'Collecting Gundam Cards',
        content: [
          'The Gundam Card Game has a smaller player base and print run compared to major TCGs like Pokemon or MTG, which can make rare cards harder to find but also more rewarding to collect. Cards featuring iconic mobile suits like the RX-78-2, Wing Zero, Strike Freedom, and Barbatos are popular among collectors.',
          'Look for special rarity cards with premium artwork or alternate illustrations of fan-favorite units. Because the market is smaller, prices tend to be more stable than volatile TCGs, making collecting more predictable. Local Gundam hobby shops and import stores may carry Japanese products with exclusive cards.',
        ],
      },
    ],
    faq: [
      { question: 'Do I need to know Gundam to play the card game?', answer: 'No prior Gundam knowledge is needed. The game teaches you the mechanics on its own. However, fans of the franchise will enjoy recognizing characters, mobile suits, and battle references from the anime series.' },
      { question: 'How does the Gundam Card Game compare to other TCGs?', answer: 'The Gundam Card Game is less complex than Yu-Gi-Oh! and MTG but offers meaningful strategic depth through its unit-pilot pairing system and color faction mechanics. It\'s a good fit for players who want engaging tactical gameplay without overwhelming combo complexity.' },
      { question: 'Where can I buy Gundam cards?', answer: 'Local game stores, Gundam hobby shops, and online retailers carry Gundam Card Game products. Japanese import stores and sites like AmiAmi or Plaza Japan offer Japanese-exclusive products. For singles, check TCGplayer and dedicated Gundam card communities.' },
    ],
  },
}
