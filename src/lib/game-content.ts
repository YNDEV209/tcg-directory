interface GameContent {
  overview: string[]
  howToPlay: string
  collectingTips: string[]
  keyMechanics: { name: string; description: string }[]
  faq: { question: string; answer: string }[]
}

export const GAME_CONTENT: Record<string, GameContent> = {
  pokemon: {
    overview: [
      'The Pokemon Trading Card Game launched in 1996 in Japan and quickly became one of the most popular collectible card games worldwide. Originally developed by Media Factory and later managed by The Pokemon Company, the TCG mirrors the beloved video game franchise where players build decks around Pokemon creatures to battle opponents.',
      'With over 100 expansions released across multiple eras — from the original Base Set through Sun & Moon, Sword & Shield, and the current Scarlet & Violet series — the Pokemon TCG has printed tens of thousands of unique cards. Each generation introduces new mechanics, card types, and art styles that keep both collectors and competitive players engaged.',
      'Today the Pokemon TCG boasts one of the largest competitive scenes in trading card games, with official Play! Pokemon tournaments held globally. The secondary market for rare Pokemon cards has exploded in recent years, with vintage holographic cards from early sets fetching thousands of dollars at auction.',
    ],
    howToPlay: 'Each player builds a 60-card deck featuring Pokemon, Trainer, and Energy cards. Players take turns attaching Energy to their Pokemon, playing Trainer cards for strategic effects, and using attacks to knock out the opponent\'s Pokemon. The goal is to take six Prize cards by knocking out your opponent\'s Pokemon, or win if your opponent cannot draw a card or has no Pokemon in play. The game rewards strategic deck building, resource management, and understanding type matchups.',
    collectingTips: [
      'Start with the latest expansion to find cards that are tournament-legal in Standard format and readily available at retail prices.',
      'Look for "chase cards" like Illustration Rare, Special Art Rare, and Hyper Rare variants — these hold the most long-term collectible value.',
      'Check card centering, edge condition, and surface quality if you plan to submit cards for professional grading through PSA or CGC.',
      'Elite Trainer Boxes offer the best value for opening packs, while booster bundles are more cost-effective than individual packs.',
      'Track price trends on TCGplayer before buying singles — prices often dip a few weeks after a set releases as supply increases.',
    ],
    keyMechanics: [
      { name: 'Type Matchups', description: 'Pokemon have elemental types (Fire, Water, Grass, etc.) with weakness and resistance mechanics that double or reduce incoming damage, making type coverage a core deck-building consideration.' },
      { name: 'Evolution', description: 'Basic Pokemon evolve into Stage 1 and Stage 2 forms, gaining stronger attacks and higher HP. Evolution lines require setup time but reward patience with powerful late-game abilities.' },
      { name: 'Energy System', description: 'Attacks require specific Energy types attached to a Pokemon. Players attach one Energy per turn from their hand, making Energy acceleration abilities highly valuable in competitive play.' },
      { name: 'Trainer Cards', description: 'Supporters, Items, and Stadium cards provide draw power, search effects, healing, and disruption. Building the right Trainer engine is often more important than the Pokemon themselves.' },
      { name: 'Prize Cards', description: 'Six cards are set aside face-down at the start of the game. Each time you knock out an opponent\'s Pokemon, you take one or more Prize cards. ex and VSTAR Pokemon give up two Prizes when knocked out, creating risk-reward trade-offs.' },
    ],
    faq: [
      { question: 'How many cards are in a Pokemon TCG deck?', answer: 'A standard Pokemon TCG deck contains exactly 60 cards. You can include up to 4 copies of any card with the same name, except for Basic Energy cards which have no limit. Your deck must include at least one Basic Pokemon to be legal.' },
      { question: 'What is the most valuable Pokemon card?', answer: 'The most valuable Pokemon card is the 1st Edition Base Set Shadowless Charizard, which has sold for over $400,000 in PSA 10 condition. Among modern cards, Special Art Rares and Illustration Rares from recent Scarlet & Violet sets can be worth $50-$200+ depending on the Pokemon featured.' },
      { question: 'What does Standard format mean in Pokemon TCG?', answer: 'Standard format is the primary competitive format that only allows cards from the most recent sets (typically the last two years of expansions). Cards rotate out of Standard annually, keeping the format fresh. Expanded format allows a wider pool of older cards.' },
      { question: 'How do I know if my Pokemon card is rare?', answer: 'Check the rarity symbol in the bottom-right corner of the card: a circle means Common, a diamond means Uncommon, and a star means Rare. Additional designations like Holo Rare, Ultra Rare, Illustration Rare, and Special Art Rare indicate increasing scarcity and value.' },
      { question: 'What are the different Pokemon card types?', answer: 'Pokemon cards are categorized into three main types: Pokemon (the creatures that battle), Trainer cards (Items, Supporters, and Stadiums that provide effects), and Energy cards (required to power attacks). Pokemon themselves have elemental types like Fire, Water, Grass, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, and Colorless.' },
    ],
  },
  mtg: {
    overview: [
      'Magic: The Gathering, created by mathematician Richard Garfield and published by Wizards of the Coast in 1993, is the original collectible card game and remains the gold standard of the genre. With over 27,000 unique cards printed across hundreds of sets, MTG offers unmatched depth in both gameplay strategy and collecting.',
      'The game is built around five colors of mana — White, Blue, Black, Red, and Green — each representing different philosophies and play styles. White emphasizes order and protection, Blue focuses on knowledge and control, Black pursues power at any cost, Red channels chaos and aggression, and Green represents nature and growth. The interplay between these colors creates one of the richest strategic landscapes in gaming.',
      'Magic has a thriving competitive scene spanning multiple formats, from Standard (recent sets only) to Modern, Legacy, and the wildly popular Commander format. The secondary market for MTG cards is robust, with iconic cards like Black Lotus valued at over $500,000 and many staple cards holding steady value for years.',
    ],
    howToPlay: 'Players build decks of at least 60 cards (or 100 for Commander) using a combination of lands, creatures, instants, sorceries, enchantments, artifacts, and planeswalkers. Each turn, you may play one land that produces mana, then spend mana to cast spells. Creatures attack and block in combat. The goal is to reduce your opponent from 20 life to 0. The stack system allows for complex spell interactions and instant-speed responses, giving MTG its signature strategic depth.',
    collectingTips: [
      'Focus on format staples if you want cards that hold value — lands like fetch lands and shock lands are always in demand across multiple formats.',
      'Collector Boosters contain the highest density of premium cards including foils, borderless variants, and serialized cards.',
      'Commander preconstructed decks offer excellent value with multiple reprints of expensive staples and unique new cards.',
      'Watch reprint cycles — cards tend to spike before reprints are announced and drop after. Buying post-reprint saves money.',
      'Store cards properly in sleeves and toploaders. Humidity and sunlight damage MTG cards quickly, reducing both playability and resale value.',
    ],
    keyMechanics: [
      { name: 'Mana System', description: 'Lands produce colored mana used to cast spells. The five colors each have distinct strengths: White excels at life gain and tokens, Blue at card draw and counters, Black at removal and recursion, Red at direct damage, and Green at large creatures and ramp.' },
      { name: 'The Stack', description: 'Spells and abilities go on the stack and resolve in last-in, first-out order. Players can respond to each other\'s spells at instant speed, creating layered interactions that reward timing and bluffing.' },
      { name: 'Combat Phase', description: 'Attackers are declared, then defenders choose blockers. Damage is assigned simultaneously. Evasion abilities like flying, trample, and menace add tactical complexity to every combat step.' },
      { name: 'Card Advantage', description: 'Drawing more cards than your opponent is one of MTG\'s most fundamental strategic concepts. Cards that generate two-for-one exchanges or provide recurring value are the backbone of winning strategies.' },
      { name: 'Formats', description: 'MTG supports multiple formats with different card pools: Standard (recent sets), Pioneer, Modern, Legacy, Vintage, and Commander (100-card singleton multiplayer). Each format has its own banned list and metagame.' },
    ],
    faq: [
      { question: 'How many cards are in a Magic: The Gathering deck?', answer: 'A standard MTG deck requires a minimum of 60 cards with no maximum, though 60 is optimal. In Commander format, decks are exactly 100 cards including the commander. You may include up to 4 copies of any non-basic land card in constructed formats, while Commander is singleton (one copy each).' },
      { question: 'What is Commander format in MTG?', answer: 'Commander (also called EDH) is a multiplayer format where each player builds a 100-card singleton deck led by a legendary creature as their commander. It\'s the most popular casual MTG format, emphasizing creativity, politics, and memorable game moments over strict competition.' },
      { question: 'What are the most valuable Magic cards?', answer: 'The Power Nine from Alpha/Beta (1993) are the most valuable, led by Black Lotus which has sold for over $500,000. Among modern cards, serialized cards, extended art mythics, and format staples like fetch lands command premium prices ranging from $20 to several hundred dollars.' },
      { question: 'What is the best MTG format for beginners?', answer: 'Standard is the most accessible competitive format since it uses a smaller card pool from recent sets. For casual play, Commander preconstructed decks provide a ready-to-play experience with built-in variety. Arena (the digital version) is also excellent for learning the rules for free.' },
      { question: 'How does the color system work in Magic?', answer: 'The five colors each have distinct philosophies and mechanical strengths. White focuses on small creatures and protection, Blue on card draw and countermagic, Black on destruction and recursion, Red on speed and direct damage, and Green on large creatures and mana acceleration. Most competitive decks combine two or three colors.' },
    ],
  },
  yugioh: {
    overview: [
      'Yu-Gi-Oh! launched in 1999 as a tie-in to the manga and anime series by Kazuki Takahashi, and has since grown into one of the best-selling trading card games in history with over 35 billion cards sold worldwide. Published by Konami, the game is known for its fast-paced duels, complex combo chains, and constantly evolving metagame.',
      'Unlike many other TCGs, Yu-Gi-Oh! has no rotating format — every card ever printed is legal unless specifically placed on the Forbidden & Limited list. This means the card pool is enormous, with over 12,000 unique cards spanning archetypes from Blue-Eyes White Dragon to modern combo decks. The game rewards deep knowledge of card interactions and creative deck building.',
      'The Yu-Gi-Oh! competitive scene is highly active, with official Konami tournaments (YCS events) drawing thousands of players. The secondary market is driven by meta relevance — cards that see competitive play can spike dramatically in price, while reprints in structure decks and tins make the game more accessible to new players.',
    ],
    howToPlay: 'Players duel with 40-60 card Main Decks plus a 15-card Extra Deck and Side Deck. Each turn involves drawing, summoning monsters, setting spells and traps, and battling. The goal is to reduce your opponent\'s Life Points from 8000 to 0. Yu-Gi-Oh! features multiple summoning mechanics — Normal, Tribute, Fusion, Synchro, Xyz, Pendulum, and Link — each adding strategic layers. There is no mana system; instead, stronger monsters require tributes or specific materials, making resource management about card advantage and board presence.',
    collectingTips: [
      'Structure decks are the best entry point — they contain a playable 40-card deck with key staple cards for around $10.',
      'Quarter Century Secret Rares and Starlight Rares are the most collectible modern rarities, often worth $100+ per card.',
      'Buy singles for competitive play rather than opening packs — Yu-Gi-Oh! pack odds can be unforgiving for specific chase cards.',
      'Keep an eye on the Forbidden & Limited list updates (published quarterly) as they directly impact card prices and meta viability.',
      'Tin releases and reprint sets like Maximum Gold offer significant savings on staple cards that were previously expensive.',
    ],
    keyMechanics: [
      { name: 'Summoning Types', description: 'Yu-Gi-Oh! features seven summoning methods: Normal Summon, Tribute Summon, Fusion (combining materials), Synchro (Tuner + non-Tuner), Xyz (overlaying same-level monsters), Pendulum (scale-based), and Link (materials based on arrows). Mastering these is essential for competitive play.' },
      { name: 'Chain System', description: 'Effects activate and resolve in chains (similar to a stack). Players alternate adding effects to the chain, which then resolves backwards. Understanding chain links, spell speeds, and timing (\'when\' vs \'if\') is critical for advanced play.' },
      { name: 'Archetypes', description: 'Most Yu-Gi-Oh! decks are built around themed card groups (archetypes) like Blue-Eyes, Dark Magician, or Branded. Archetype cards synergize with each other through naming conventions and shared effects, encouraging themed deck building.' },
      { name: 'Hand Traps', description: 'Monster cards that activate their effects from the hand during either player\'s turn serve as interactive disruption. Cards like Ash Blossom, Effect Veiler, and Maxx "C" define the format by providing counterplay without requiring set cards.' },
      { name: 'Going First vs Second', description: 'The choice to go first or second is a major strategic decision. Going first allows you to set up an unbreakable board with negation effects, while going second gives you the first attack and access to powerful board-breaking cards.' },
    ],
    faq: [
      { question: 'How many cards are in a Yu-Gi-Oh! deck?', answer: 'The Main Deck must contain between 40 and 60 cards, with 40 being optimal for consistency. You also have a 15-card Extra Deck (for Fusion, Synchro, Xyz, and Link monsters) and a 15-card Side Deck for swapping cards between games in a match. Up to 3 copies of any non-limited card are allowed.' },
      { question: 'What is the best Yu-Gi-Oh! deck for beginners?', answer: 'Structure decks like the Blue-Eyes or Dark Magician decks are great starting points. For competitive play on a budget, buying three copies of a recent structure deck gives you a solid 40-card deck. The Branded Despia and Labrynth archetypes are also beginner-friendly with strong performance.' },
      { question: 'What is the banlist in Yu-Gi-Oh?', answer: 'The Forbidden & Limited list is updated quarterly by Konami to balance the game. Forbidden cards cannot be used at all, Limited cards allow 1 copy, and Semi-Limited cards allow 2 copies. This list directly impacts which decks are viable and can cause dramatic price shifts in the secondary market.' },
      { question: 'What are the rarest Yu-Gi-Oh! cards?', answer: 'The rarest modern rarities are Starlight Rare (approximately 1 per 2 cases), Quarter Century Secret Rare, and Ghost Rare. Among vintage cards, first-edition cards from Legend of Blue Eyes White Dragon and Metal Raiders command premium prices, with the LOB-000 Blue-Eyes White Dragon being iconic.' },
      { question: 'How does the Extra Deck work in Yu-Gi-Oh?', answer: 'The Extra Deck holds up to 15 Fusion, Synchro, Xyz, Link, and Pendulum monsters (when face-up). These are not drawn — instead, they are summoned to the field when you meet the required summoning conditions using monsters from your field or hand. The Extra Deck is a toolbox of powerful options available throughout the duel.' },
    ],
  },
  onepiece: {
    overview: [
      'The One Piece Card Game launched in 2022 by Bandai and quickly became one of the fastest-growing trading card games on the market. Based on Eiichiro Oda\'s legendary manga and anime series, the TCG captures the spirit of the Grand Line with its strategic gameplay and stunning card artwork drawn from decades of One Piece history.',
      'The game introduces a unique Leader-based system where each deck is built around a Leader card representing a captain like Monkey D. Luffy, Trafalgar Law, or Roronoa Zoro. The color system (Red, Blue, Green, Purple, Black, and Yellow) defines each deck\'s play style, from aggressive rushdown to defensive control strategies.',
      'Despite being relatively new, the One Piece TCG has developed a passionate competitive community with official Bandai tournaments held worldwide. The game\'s manga-quality art and connection to the beloved anime series have made certain cards — particularly alternate art Leaders and Secret Rare character cards — highly sought after by both collectors and fans.',
    ],
    howToPlay: 'Each player starts with a Leader card and a 50-card deck. The goal is to reduce the opponent\'s Leader to 0 life by attacking with characters. On your turn, you attach one DON!! card (the game\'s energy resource) from your DON!! deck, then play characters, trigger events, and attack. Characters can attack the opponent\'s Leader or rested characters. The DON!! system provides increasing resources each turn (up to 10), creating a natural power curve. Managing your Leader\'s life cards is key — each life card lost goes to your hand, giving you more options but bringing you closer to defeat.',
    collectingTips: [
      'Starter decks are the best entry point and include exclusive Leader cards not available in booster packs.',
      'Alternate art and manga art variants are the most collectible cards, often worth significantly more than standard versions.',
      'The One Piece TCG has aggressive release schedules — new boosters launch frequently, so prices on current set singles tend to drop quickly after release.',
      'Look for Secret Rare and Special Art cards featuring iconic manga panels — these are the long-term collectible highlights of each set.',
      'Japanese cards are typically cheaper than English versions due to larger print runs. Some collectors prefer the Japanese art and card quality.',
    ],
    keyMechanics: [
      { name: 'Leader System', description: 'Every deck is commanded by a Leader card that stays on the field for the entire game. Leaders have unique abilities, a color identity that determines which cards can go in your deck, and a life total that serves as your health. Choosing the right Leader defines your entire strategy.' },
      { name: 'DON!! System', description: 'Each turn you gain DON!! cards (energy) from a separate 10-card deck, providing a predictable resource curve from 1 to 10. DON!! can be attached to characters to boost their power by 1000 each, or spent to play cards. This dual-use system creates interesting decisions between powering up attackers and playing new cards.' },
      { name: 'Life Cards', description: 'When your Leader takes damage, you move cards from your Life area to your hand. This means losing life actually gives you more cards to play with, creating a natural comeback mechanic. Some cards also have Trigger effects that activate for free when drawn as Life damage.' },
      { name: 'Counter System', description: 'Characters in your hand can be discarded during the opponent\'s attack to add their Counter value to your Leader\'s power, helping you survive attacks. This means every card in your hand has defensive value, making hand management crucial.' },
      { name: 'Color Identity', description: 'The six colors (Red, Blue, Green, Purple, Black, Yellow) each have distinct play styles. Red is aggressive, Blue controls the tempo, Green ramps DON!!, Purple manipulates costs, Black removes threats, and Yellow specializes in life manipulation and triggers.' },
    ],
    faq: [
      { question: 'How many cards are in a One Piece TCG deck?', answer: 'A One Piece TCG deck consists of exactly 50 cards plus your Leader card and a separate 10-card DON!! deck. You may include up to 4 copies of any card (by card number). All cards in your deck must match or include the color of your Leader card.' },
      { question: 'What is the most valuable One Piece TCG card?', answer: 'The most valuable cards are typically alternate art Leaders and Secret Rare character cards from early sets like Romance Dawn and Paramount War. Manga art variants featuring iconic panels from the series are particularly sought after, with top cards reaching $100-$500+ depending on the character and rarity.' },
      { question: 'Is the One Piece TCG good for beginners?', answer: 'Yes, the One Piece TCG is one of the most beginner-friendly trading card games available. The DON!! resource system provides a clear power curve, starter decks are competitive and affordable, and the rules are straightforward compared to games like Yu-Gi-Oh! or Magic. The connection to the anime/manga also makes it easy to engage with the card themes.' },
      { question: 'What colors should I play in One Piece TCG?', answer: 'Red is the most beginner-friendly color with aggressive, straightforward strategies. Blue suits players who like controlling the game tempo. Green is strong for those who enjoy ramp strategies. Purple, Black, and Yellow offer more complex play styles suited to experienced card game players.' },
      { question: 'How does attacking work in One Piece TCG?', answer: 'Characters and your Leader can attack once per turn by resting (turning sideways). You can attack the opponent\'s Leader or their rested characters. The defending player can use Counter values from cards in hand to boost their power. If the attacker\'s power is equal to or greater than the defender\'s, the attack succeeds.' },
    ],
  },
  gundam: {
    overview: [
      'The Gundam Card Game, officially known as Gundam Card Game: Card Battler, is a trading card game published by Bandai based on the iconic Gundam mecha franchise. Drawing from decades of Gundam anime series — from the original Mobile Suit Gundam to Iron-Blooded Orphans and The Witch from Mercury — the TCG lets players command mobile suits, pilots, and military forces in strategic card battles.',
      'The game features three main card types: Unit cards (mobile suits and mechas), Command cards (tactical maneuvers and abilities), and Character cards (pilots and crew). Each card belongs to a color faction that determines its strategic role, with deck building centered around combining units with compatible pilots for maximum effectiveness.',
      'While newer and smaller in scale compared to Pokemon or MTG, the Gundam Card Game has a dedicated following among mecha anime fans and card game enthusiasts. The artwork features detailed mobile suit illustrations and scenes from across the Gundam multiverse, making the cards appealing to collectors of Gundam merchandise.',
    ],
    howToPlay: 'Players build decks using Unit, Command, and Character cards tied to a color faction. Each turn involves deploying units to the battlefield, assigning pilots, and engaging the opponent\'s forces. The resource system is based on card deployment costs, with players managing their available resources each turn to field the strongest combination of mobile suits and support cards. Victory is achieved by dealing enough damage to the opponent\'s base or achieving specific win conditions set by the game\'s scenario mode.',
    collectingTips: [
      'Starter sets are the best way to learn the game and include exclusive cards not found in booster packs.',
      'Cards featuring iconic mobile suits like the RX-78-2 Gundam, Wing Zero, and Barbatos tend to hold collector value regardless of competitive viability.',
      'The game has a smaller print run than major TCGs, which can make certain rare cards harder to find but also more collectible long-term.',
      'Look for cards with artwork from popular Gundam series like Seed, Wing, and The Witch from Mercury — these tend to be the most sought after by fans.',
    ],
    keyMechanics: [
      { name: 'Unit Deployment', description: 'Mobile suits and mechas are deployed to the battlefield as Unit cards. Each unit has attack power, HP, and special abilities that reflect their capabilities from the anime series. Deploying the right units at the right time is the core tactical decision.' },
      { name: 'Pilot System', description: 'Character cards can be assigned to Unit cards as pilots, granting bonus stats and activating combination abilities. Pairing the correct pilot with a compatible unit — like Amuro Ray with the RX-78-2 — unlocks powerful synergy effects.' },
      { name: 'Color Factions', description: 'Cards are divided into color factions that determine play style and deck building restrictions. Each color emphasizes different strategies, from aggressive assault to defensive positioning and support-based tactics.' },
      { name: 'Command Cards', description: 'Command cards represent tactical decisions and special maneuvers. They can be played during specific phases to buff units, disrupt the opponent, or trigger special effects. Managing your command options is key to outmaneuvering your opponent.' },
    ],
    faq: [
      { question: 'How do I start playing the Gundam Card Game?', answer: 'The best way to start is with a starter deck, which includes a pre-built deck of 50 cards, a rulebook, and everything needed to play. Starter decks are themed around specific Gundam series, so choose one featuring your favorite show to get cards you\'ll enjoy collecting.' },
      { question: 'What Gundam series are represented in the card game?', answer: 'The card game spans the entire Gundam franchise, including Mobile Suit Gundam (UC timeline), Gundam Wing, Gundam SEED, Gundam 00, Iron-Blooded Orphans, The Witch from Mercury, and many more. Each series contributes unique Unit, Character, and Command cards with artwork and abilities inspired by the shows.' },
      { question: 'Are Gundam cards valuable to collect?', answer: 'While the Gundam TCG has a smaller market than Pokemon or MTG, rare cards — especially those featuring iconic mobile suits with premium artwork — can command solid prices among collectors. The limited print runs compared to larger TCGs mean supply is lower, which can benefit collectors long-term.' },
      { question: 'Can I mix different Gundam series in one deck?', answer: 'Yes, deck building allows cards from different Gundam series as long as they share the same color faction. This means you can create dream team decks combining units and pilots from across the Gundam multiverse, limited only by color restrictions and deck size.' },
    ],
  },
}
