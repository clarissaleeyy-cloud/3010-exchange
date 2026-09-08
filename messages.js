// ─────────────────────────────────────────────────────────
// EDIT THIS FILE to write your own envelope messages.
// Each mood has a list of envelopes. Add, remove, or rewrite
// as many as you like — the grid resizes automatically.
// "label" is what shows on the sealed envelope (keep it short).
// "text" is what he sees once he opens it.
//
// IMPORTANT: "text" values use backticks ( ` ) instead of regular
// quotes ( " ) so that multi-line messages (with blank lines /
// paragraph breaks) work safely. Keep using backticks for any new
// letters you add — regular double quotes will break the file if
// the message spans more than one line.
//
// THREE RULES THAT WILL SAVE YOU. If any of these are broken, NONE
// of the letters load anywhere on the site — not just the broken one.
//   1. A message that opens with a backtick ` must CLOSE with a
//      backtick. Not a " and not a '.
//   2. Every } that ends a letter needs a comma after it, unless
//      it's the last letter in that mood.
//   3. Mood names can't contain spaces. "surprise" is fine,
//      "surprise me" is not.
// If letters ever stop showing, press F12, open the Console tab, and
// the red error will tell you the line number.
//
// ATTACHING MEDIA — photo, video and audio each take one path or a list:
//   photo: "media/one.png"
//   photo: ["media/one.png", "media/two.png"]
//   video: "media/clip.mov"
//   audio: ["media/voice-1.m4a", "media/voice-2.m4a"]
// ─────────────────────────────────────────────────────────

const MOOD_MESSAGES = {
  surprise: [
    { label: "letter 1", text: `today i shall tell u a story! of my most embarrassing moment (when i peed myself in public)… I THINK i have mentioned it before but maybe not in detail HAHAH 
so this happened when i was 12 years old!!! (already quite old so embarrassing..) and it was post-psle results release when they were giving out awards and certificates. so i REALLY needed to pee but we had to sing national anthem, school song, and listen to principal address wtv… but i COULDNT GO PEE cause i was one of the first few ppl to go up stage and get the award. so i was js HOLDING IT IN. 
and then i forgot when exactly i think might be during the sch song or smth… i cldnt hold it in anymore… and i peed… and once the floodgates opened i COULD NOT STOP. gosh… but thankgod no one looking during sch song right HAHA BUT IMMEDIATELY AFTER i was like fk fk ive got to cover it up somehow cause obv ppl realised there was WATER on the floor. so i spilt my bottle “accidentally” and was like ohno!!! lemme clean this up !!! (thank god the floor was like not white / my pee was not too yellow gosh). 
then uk somehow i forgot why the PARENTS came to help clean. like i think my mom and scott’s mom? (unless my memory is trolling me) were helping me clear up and i was js thinking fkfkfk i hope they dont realise it’s DILUTED PEEEEE. anw then my skirt WET RIGHT. but i was like ohno my water spill on my skirt so i went to the toilet to “clean it up” and i was like trying to dry my skirt w the handdryer… anw it was really rabz… and now looking back on it i feel like the parents probably knew what was going on because no way right HAHAHA but i’m glad no one ever called me out for it and now it’s just a secret i’ll take to my grave…
okie this is my yappy yap of the day!!! as always i miss u my love for u is bursting just like my bladder HAHAHAHAH kidding muacksies!!! 
` },
    { label: "letter 2", text: `hmm what shall my yap be for today… lemme tell u about another really embarrassing moment of my life… it is about me and scott (the pri sch guy bestie who is taken) but once again pls b reassured that ill never be interested in this guy again HAHAHA

kay so our pri school class teachers organised this “hunger games”-themed sports day for us!! idt uve read or watched hunger games right so lemme try and explain the references to u… the highlight of the sports day was like basically a nerf gun war, and the hunger games aspect was that every class would select 2 people to represent them (like the 2 tributes per district in hunger games). so scott and i played (fsr idk why!) and we made it!! to the end!! tbf it was mostly him killing people and me dodging and running for my life… my aim sucks 🤣 

anw so we were the last 2 right and idk why we didn’t win i think only one person could win?? or maybe we made the whole thing up. but basically at the end of hunger games, katniss and peeta (the main characters) were the last 2 standing right, then suddenly there was an announcement that only one person can win (aka they need to kill each other). and because they “loved” each other and wanted to spite the gamemakers, they attempted to eat a poisonous berry each and commit suicide so there would be no winner at all. ok so with this in mind, me and scott tried to “do the same thing” by like shooting each other with the nerf gun… tbh idk if anyone even remembers or saw this moment but for me whenever i think back about it IT IS SO EMBARRASSING

like we did this in front of majority of our batch 🤯🤯🤯 and i think it was unnecessary cause there was someone left who didn’t die i think… which is why the game didnt end… then when we realised we killed that person and the game ended. so like we did not need to be so dramatic and “commit suicide” 🤣🤣 anw this is another one of my top few most embarrassing moments.. when i really was like headoverheels puppy love crush energy and did such a cringe thing in front of everyone. i dont rmb the exact details of the moment le but ill rmb the embarrassment i felt then for life` },
    { label: "letter 3", text: `another random yap is that uk how i love hamilton (the musical) so much! when i was sec2…? this group of rgs kids decided to form a “theatre kid” friend group thing and perform our own hamilton musical! and i joined! cause fsr from young i’ve had this unfounded confidence about my singing abilities 🤣🤣 say reals idk why i always think i can sing when ive never even been accepted into choir 😔😔 HAHAHA anw so i joined with kimmie and nicolle (our other pri sch friend in rgs whom i dont talk to anymore).

i auditioned for eliza (the female lead btw) and the King (cause i liked his song) HAHAHA anw it was lowkey so legit like we wld go in to rooms one by one and sing our auditioned songs. and i was too shy to sing at home w everyone so i only ever practised in the toilet (so evidently i was not great esp since some of the ppl there could really sing). anw so they didnt even let me audition for eliza because they had already picked someone else for that role by the time i auditioned 😔😔 and ofc i was disappointed but tbh the girl they chose was really good so wtv la HAHAHA and i got assigned the really small role of a girl called peggy. shes eliza and angelica’s sister but all she really sings r the words “and peggy” 🤣🤣🤣🤣 but in the end this musical thing never happened sad. this cld have been the start of my theatre kid era!! but alas it didnt happen` },
 { label: "letter 4", text: `i just drank my coldcold water HAHAHA random fact of the day is i love cold water ifl different temperature water tastes different and ill fight anyone who disagrees HAHAHA i love cold and hot water room temp water sucks.` },

{ label: "letter 5", text: `another random fact! i have a keloid (dk if uk what this is but basically when u hv a wound then ur skin heals but it OVERgrows so there’s a protruding lump of skin over the wound) on my right kneecap!!! not sure if you’ve ever noticed (probably not it’s p small now) HAHAHA but it’s from when i fell in primary school! i think it was p2? or p3. when i got off the school bus, and i ran through the grassfield to get to the parade square for morning assembly, except i tripped over something and fell. and i think the grass was like p sharp or smth so it cut me and i was bleeding like craaaaazy. i think for primary 2 me that was like the most pain ive felt in my 8 years of living HAHHAHA and i fell with my GIGANTIC SCHOOL BAG so it crushed me too. then my friend brought me to the general office who had to patch me up and i walked around with a gigantic gauze and plaster on my knee! and now it’s long healed but there’s a scar (photo for you because idt you know this exists)`,
photo: ["media/random-letter5.png"] },
 { label: "letter 6", text: `idk if this is a common experience but in primary school i used to make towers out of my pens and pencils and highlighters during exams HAHAAH like when i was done with the paper and done checking and overall just Very bored i would make towers out of my pens!!! so i would purposely bring aloooot of stationery into the exam venue just so i could play with them HAHAHAHA also i used to draw random things / calligraph random lyrics (very uglily) on my exam paper and sing to myself in the middle of the exam HAHAHA overall i think i was a v distracting person to sit near to during an exam oopsies 

another random exam fact is in j2 on the day of taylor swift concert presale tickets, i was hving my math paper 2 exam! (the stats one) and i was so stressed because the presale start time was like 1h after the exam ended. so throughout the whole second half of the exam i was suuper distracted and i kept checking the clock and my heart was palpitating OOOOOPS. in the end i barely passed the second half of the paper HAHAHAHAH it was Bad oopsies but i got my tickets in the end so who cares !!!` },
 { label: "letter 7", text: `my childhood dream was actl to be a pianist HAHA like i think playing the piano was the one passion / interest that i genuinely developed on my own without any external influence. surprisingly my sis never played piano, and my friends also never played piano. and my parents never made me learn it HAHAHA so i genuinely started liking piano after walking past a piano class otw to the toilet at my tuition centre and hearing them play. and i was like wow this sounds so nice i really wna learn HAHAH and until now i still REALLY love piano but fsr i just suck so bad at it and i have no patience or resilience to keep practising to get really good at a song… so depressing in another life i wish i was good at piano` },

  ],

  sad: [
    { label: "letter 1 :(", text: `WHY ARE YOU SAD! please tell me more. but here’s another (bad) joke! why is golf so addictive?

it’s a HOLE lot of fun :D hahahaha cheer up soon! sending a virtual hug rn~ `,
      photo: ["media/sad-letter1.png", "media/sad-letter2.png"] },
    { label: "letter 2", text: `here's a song instead! 
THE COCONUT NUT IS A BIG BIG NUT IF U EAT TOO MUCH U GET VERY FAT `,
      audio: "media/sad-letter2.m4a" },
    { label: "letter 3", text: `hello dear!! m not q sure if ure feeling sad today because of me… HOPEFULLY NOT but i’m assuming in the 4 months ure gone we would fight at least once right HAHAHAHA IF URE NOT maybe u shd close this and read another msg!!! maybe u wont open my letter when ure upset w me… but regardless!! i would just like to say that when we r living miles apart but fighting, it’s prob even harder for u to Feel my love 🤣 so ull prob be focusing on all the unhappiness!!! and i might not remember to tell u that i love u and care for u, so i’m telling it to u rn!! please always remember that!!! at the end of the day i do believe that we r not each other’s enemy 😁

please also rmb that i get sad when we fight 😔😔😔 ask me if i’m ok!!!! i’ll appreciate it lots ❤️ love u dear! feel better soon 

here’s a video of waves 🌊 
https://www.youtube.com/watch?v=hw32XIVdHCU` },
    { label: "letter 4", text: `you’re sad now as i am writing this :( who / what is making you sad!! lemme (ง’̀-‘́)ง them rn!! sometimes (most of the time) idrk what to do/say when you’re sad 😔😔 ifl this is a science experiment that i’m still trying to figure out HAHAH but regardless of wtv nonsense i’m saying, this sadness / tiredness / upset-ness will pass !! and when it does pass i will still be here for u heheh. it’ll be okay! sending many hugs and hoping you’ll wake up tomorrow feeling more refreshed and happier :D

here is a cute pingu video for u! 
https://www.tiktok.com/@pingu/video/7621697896315931917?_r=1&_t=ZS-99SBqaUNg9A
https://www.youtube.com/watch?v=LZ5gyhj5qeE` },
    { label: "letter 5", text: `hello! if you’ve made it all the way here icb you’ve been sad for 5 times :( in 4 months!! the world is not being very fair to you ☹️☹️ big boo! for your little pick-me-up/cheer-up thing, watch this video !!! 
https://www.youtube.com/watch?v=DSSUOcuUego
(8 years ago mayb they’ve truly fallen off)
(I’M KIDDING ily here’s a more recent one https://www.youtube.com/watch?v=VoUmriKF-sI)` }
  ],

  homesick: [
    { label: "letter 1", text: `here is a list of google map locations of asian supermarkets and asian food in cali HAHAHA time to shop/eat? heheh 

https://maps.app.goo.gl/rwzjeaByvkrS1qmu8

(after knowing where your uni housing is these places all seem FAR but UH i hope you figure it out.. HAHAHA)` },
    { label: "letter 2", text: `here’s a recipe for all the SG food (i gave up on SG now it’s just asian) u might want to make !!! 
1. chicken rice https://thewoksoflife.com/hainanese-chicken-rice/#recipe https://www.youtube.com/watch?v=fX1cajv0CXY 
2. watercress soup?? (but hard to find the wolfberries and stuff)  https://www.youtube.com/watch?v=8UPa76Hfdjo

3. https://youtube.com/shorts/9EuWNhSzvCk?is=m3Rzs2J9Q81p5vmy not asian but it looks gooddd

4. https://vt.tiktok.com/ZSqM2tHm5/ mayb tiktok isnt the best place for recipes but ive alw wanted to make this ifl it’s idiotproof 
5. https://vt.tiktok.com/ZSqMjsKJu/ round 2 for our oyakodon` },
    { label: "letter 3", text: `here’s a link to the singapore mrt map game heheh that you’re so damn good at 🤣🤣 a little piece of sg!!
https://www.sporcle.com/games/yellowflip999/fill-the-singapore-mrt-map
` },
    { label: "letter 4", text: `a little piece of home for u heheh HAHAHA go and watch the singaporean driving traffic videos !!! or hokkien videos about people cursing and laughing`,
      video: "media/homesick-letter2.mov" }
  ],

  happy: [
    { label: "ichi", text: `hello my dear boyfriend!! YOU’RE HAPPY! so i’m happy HEHEHEH what r u happy about please text me and let me know so we can #spreadthejoy <3 im glad you are absolutely elated HAVE THE BEST DAY
` },
    { label: "ni", text: `YAYY fireworks for you HEHEH i’m glad today has been a Good Day!!! do tell me more i miss your yaps heheh i hope everyday continues to be a GOOD GOOD DAY! kissies from 100000km away heheh bluetooth connected!!!`, effect: "fireworks" },
    { label: "san", text: `HELLOOO i realised it’s quite hard to reply to your happiness when i have no idea what’s making you happy! why did i create this section 🤣🤣 BUT YAYYYYY 😃😄😁😆 on the spectrum of happy faces which one r u!! HAHAHA okie im glad ure in a great mood heheh as alw share ur happy w me
https://vt.tiktok.com/ZSqYvs2oK/
(hehe shall we try this)` },
    { label: "yon", text: `REPLACE` },
    { label: "go", text: `REPLACE` }
  ],

  general: [
    { label: "letter 1", text: `hello baby~~ heheh cringe I MISS YOU! idk when you’re opening this but HMM you should missing me almost instantly right HAHAH KIDDING! while being with a new group of slightly unfamiliar people in a foreign country can be a little lonely remember that i’m alw here for u!!!! sending you a virtual hug now~~ i love you i can’t wait to see you again! and claim the 1000 huggies and kissies i am owed :D` },
    { label: "letter 2", text: `i’ve decided i shall learn from you and share a story in my messages! not sure if i ever told you this but lemme tell you about our first date from MY POV :D 
so tbh i was really pleasantly surprised when you sent me the canva “choose your date” poster thing HAHAHAH i thot it was cute and i did Not expect that cause u seemed so nonchalant about the whole thing… anw from lunch it was SEMI awk i think we both did not know what to say and we ended up looking at ur texts w amir ??? i forgot what he was saying WAS IT IFFAH but i’m glad somehow we had a convo topic and we got over that HAHAHA then cycling!!! tbh i MIGHT have preferred skating but i prob wld have fallen 100 times so maybe cycling was better HAHA but I WASNT DRESSED FOR CYCLING and my skirt kept flipping up ifl i was flashing the world (altho i was wearing shorts) but yeah it was Not Great HAHAHA but i did enjoy the view!!! 
but i think my absolute fav part was js squishing tgt at the playground swing HHAAH i think i truly started seeing the possibility of us being more than friends at that swing! i don’t even rmb what we talked about but i rmb feeling sweaty af and being alm completely pressed up against each other and yet i was happy staying in that position yapping for hours. and by the end of the date i was vv happy!!! heheh so it was a good first date i told aislinn i Would Not be Opposed to (aka i want) another date HEHEH
` },
    { label: "letter 3", text: `today’s sharing shall be about moments when i felt touched by your actions!!! OKIE FIRSTLY is when you give me random things that i need without me asking HAHA like when you bought me the powerbank and screen protector!!! like i was just surprised ig heheh and you even got me a PURPLE powerbank and a privacy screen like my old one HAHHAHA it was really thoughtful and i was super happy. okay secondly mayb not touched but i’m like 😁 when you speak to me softly HAHAHA ok maybe you talk like this to EVERYONE and im js a bobo but sometimes when you didn’t hear what i said you’ll say “whaaat” in a cute tone HAHAHAHA okie end of sharing.` },
    { label: "letter 4", text: `at the rate i go i’m gg to run out of things to write in our anni card!! isit time to start listing things i don’t like? KIDDING! today i would like to say that there are sooo many things in my room that r from u HAHHA like without opening any cupboards or drawers i think u can already count like 5 things at least that were from u. heheh i love all ur many many gifts (even if they r sometimes random HAHAHA) i hope you have a whole luggage worth of gifts for me!!! i love you am missing your presence rn :( where’s my huggie kissy!!!`,
      effect: "hearts" },
    { label: "letter 5", text: `hello dear!!! today’s thought of the day is that sometimes i get randomly sad / tired but i’m glad that somehow u always manage to cheer me up!! regardless of whether it’s u calling me to talk to me whenever i’m sad or distracting me by talking nonsense or just overall sending encouraging stickers, i’m grateful that u always manage (altho sometimes i think udek im sad) to make me happy heheh MAYBE i’m just easily comforted (unlike u BOOO) but yes i really do appreciate it!! the thought of not being able to call randomly whenever we want to and meet up is Absolutely Depressing 😔😔 I MISS U! can’t wait till u come back ehehhhe
 `,
      video: "media/iloveyou-letter5.MOV" },
    { label: "letter 6", text: `hello bae! not sure if i said this in the vday letter (i’m trying to think of New things about u that i love 🤣 cringe…) but ur smile is rly cute heheh the other day renkai saw ur tlbb to me and said ur smile is adorbs and internally i was like I AGREE (but externally i said “gay” oops) when ure happy ure all 😬😁 it’s an in between of both cause ur smile is kind of rectangular (uk bts v has a similar smile LOLOL and he was named most handsome face in the world SOOO 🤣🤣) anw u look so genuinely happy HAHAHA and i love to see it!!! makes all our photos look cute too heheh send me a smile NOW!!!` },
    { label: "letter 7", text: `hello dear! today’s msg shall be A little deeper than usual bah!!! tbh at the start when we kept fighting (oops) i did consider whether or not we were fundamentally compatible 😔 because i didn’t really have anything else to compare this with uk i had no clue if having disagreements this early on was even normal!! but one thing i realised after all those fights were that even at our Lowest moments, it seems like to you everything would always pass! (im not sure if ive said this before)

in the sense that ig while i was worried all these fights would make us break up, you never really considered that possibility (i think). and that was actually really comforting! i think sometimes i overthink and overdramatise our disagreements in our head… i’m Constantly trying to decide if this is a BIGBIG problem or just a smallsmall problem. but with u i have learnt that sometimes it’s normal to fight! and honestly i don’t need to stress so much about it… 

essentially what i am trying to say is that i’m grateful for you because you have made me no longer scared that you’re going to leave everytime we fight! and it is alot more reassuring to fight with you knowing that eventually we’ll get over it 🥰😊 (im cringing again) HAHAHA anw all this to say that i love u! even with all our fights… i can’t wait to see u again and (i guess inevitably) fight again` }
  ]
};
