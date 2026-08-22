// ─────────────────────────────────────────────────────────
// EDIT THIS FILE to write your own envelope messages.
// Each mood has a list of envelopes. Add, remove, or rewrite
// as many as you like — the grid resizes automatically.
// "label" is what shows on the sealed envelope (keep it short).
// "text" is what he sees once he opens it.
// ─────────────────────────────────────────────────────────

const MOOD_MESSAGES = {
  angry: [
    { label: "Letter 1", text: "Replace this with a message for when he's angry or frustrated." },
    { label: "Letter 2", text: "Replace this with another one." },
    { label: "Letter 3", text: "And another." }
  ],
  sad: [
    { label: "Letter 1", text: "WHY ARE YOU SAD! please tell me more. but here’s another (bad) joke! why is golf so addictive?

it’s a HOLE lot of fun :D hahahaha cheer up soon! sending a virtual hug rn~ " },
    { label: "Letter 2", text: "THE COCONUT NUT IS A BIG BIG NUT IF U EAT TOO MUCH U GET VERY FAT " },
    { label: "Letter 3", text: "And another." }
  ],
  homesick: [
    { label: "Letter 1", text: "here is a list of google map locations of asian supermarkets and asian food in cali HAHAHA time to shop/eat? heheh 

https://maps.app.goo.gl/rwzjeaByvkrS1qmu8

(after knowing where your uni housing is these places all seem FAR but UH i hope you figure it out.. HAHAHA)" },
    { label: "Letter 2", text: "a little piece of home for u heheh HAHAHA go and watch the singaporean driving traffic videos !!! or hokkien videos about people cursing and laughing" },
    { label: "Letter 3", text: "And another." }
  ],
  happy: [
    { label: "ichi", text: "hello my dear boyfriend!! YOU’RE HAPPY! so i’m happy HEHEHEH what r u happy about please text me and let me know so we can #spreadthejoy <3 im glad you are absolutely elated HAVE THE BEST DAY
" },
    { label: "ni", text: "Replace this with another one." },
    { label: "san", text: "And another." }
  ],
  i love you!: [
    { label: "Letter 1", text: "hello baby~~ heheh cringe I MISS YOU! idk when you’re opening this but HMM you should missing me almost instantly right HAHAH KIDDING! while being with a new group of slightly unfamiliar people in a foreign country can be a little lonely remember that i’m alw here for u!!!! sending you a virtual hug now~~ i love you i can’t wait to see you again! and claim the 1000 huggies and kissies i am owed :D" },
    { label: "Letter 2", text: "i’ve decided i shall learn from you and share a story in my messages! not sure if i ever told you this but lemme tell you about our first date from MY POV :D so tbh i was really pleasantly surprised when you sent me the canva “choose your date” poster thing HAHAHAH i thot it was cute and i did Not expect that cause u seemed so nonchalant about the whole thing… anw from lunch it was SEMI awk i think we both did not know what to say and we ended up looking at ur texts w amir ??? i forgot what he was saying WAS IT IFFAH but i’m glad somehow we had a convo topic and we got over that HAHAHA then cycling!!! tbh i MIGHT have preferred skating but i prob wld have fallen 100 times so maybe cycling was better HAHA but I WASNT DRESSED FOR CYCLING and my skirt kept flipping up ifl i was flashing the world (altho i was wearing shorts) but yeah it was Not Great HAHAHA but i did enjoy the view!!! but i think my absolute fav part was js squishing tgt at the playground swing HHAAH i think i truly started seeing the possibility of us being more than friends at that swing! i don’t even rmb what we talked about but i rmb feeling sweaty af and being alm completely pressed up against each other and yet i was happy staying in that position yapping for hours. and by the end of the date i was vv happy!!! heheh so it was a good first date i told aislinn i Would Not be Opposed to (aka i want) another date HEHEH
" },
    { label: "Letter 3", text: "today’s sharing shall be about moments when i felt touched by your actions!!! OKIE FIRSTLY is when you give me random things that i need without me asking HAHA like when you bought me the powerbank and screen protector!!! like i was just surprised ig heheh and you even got me a PURPLE powerbank and a privacy screen like my old one HAHHAHA SO you did put thought into it and i was really happy. okay secondly mayb not touched but i’m like 😁 when you speak to me softly HAHAHA ok maybe you talk like this to EVERYONE and im js a bobo but sometimes when you didn’t hear what i said you’ll say “whaaat” in a cute tone HAHAHAHA okie end of sharing." }
	
	{ label: "Letter 4", text: "at the rate i go i’m gg to run out of things to write in our anni card!! isit time to start listing things i don’t like? HAHAHA KIDDING! today i would like to say that there are sooo many things in my room that r from u HAHHA like without opening any cupboards or drawers i think u can already count like 5 things at least that were from u. heheh i love all ur many many gifts (even if they r sometimes random HAHAHA) i hope you have a whole luggage worth of gifts for me!!! i love you am missing your presence rn :( where’s my huggie kissy!!!" }

{ label: "Letter 5", text: "today i shall tell u a story! of my most embarrassing moment (when i peed myself in public) altho this is not very romantic… I THINK i have mentioned it before but maybe not in detail HAHAH so this happened when i was 12 years old!!! (already quite old so embarrassing..) and it was post-psle results release when they were giving out awards and certificates. so i REALLY needed to pee but we had to sing national anthem, school song, and listen to principal address wtv… but i COULDNT GO PEE cause i was one of the first few ppl to go up stage and get the award. so i was js HOLDING IT IN. and then i forgot when exactly i think might be during the sch song or smth… i cldnt hold it in anymore… and i peed… and once the floodgates opened i COULD NOT STOP. gosh… but thankgod no one looking during sch song right HAHA BUT IMMEDIATELY AFTER i was like fk fk ive got to cover it up somehow cause obv ppl realised there was WATER on the floor. so i spilt my bottle “accidentally” and was like ohno!!! lemme clean this up !!! (thank god the floor was like not white / my pee was not too yellow gosh). then uk somehow i forgot why the PARENTS came to help clean. like i think my mom and scott’s mom? (unless my memory is trolling me) were helping me clear up and i was js thinking fkfkfk i hope they dont realise it’s DILUTED PEEEEE. anw then my skirt WET RIGHT. but i was like ohno my water spill on my skirt so i went to the toilet to “clean it up” and i was like trying to dry my skirt w the handdryer… anw it was really rabz… and now looking back on it i feel like the parents probably knew what was going on because no way right HAHAHA but i’m glad no one ever called me out for it and now it’s just a secret i’ll take to my grave…

okie that was not v romantic i guess but this is my yappy yap of the day!!! as always i miss u my love for u is bursting just like my bladder HAHAHAHAH kidding muacksies!!! " }

	{ label: "Letter 6", text: "replace this" }
	{ label: "Letter 7", text: "replace this" }

  ]
};
