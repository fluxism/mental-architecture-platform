// Therapeutic pattern definitions shown in modal pop-ups when users click pattern names in AI analysis text.

export const patternDefinitions: Record<string, string> = {
	// Defense Mechanisms
	'Projection':
		'Attributing your own unacceptable thoughts or feelings to others. For example, "Everyone is judging me" often masks intense self-criticism. The feeling is yours — but it feels safer to see it in someone else.',
	'Denial':
		'Refusing to acknowledge a distressing reality. "It didn\'t really affect me" is a common form. Denial protects you from pain, but it also prevents healing.',
	'Rationalization':
		'Creating logical explanations to justify behavior or feelings that are actually driven by emotion. "I had to do it because..." The logic sounds right, but the real reason is underneath it.',
	'Intellectualization':
		'Analyzing trauma or pain in abstract, theoretical terms to avoid actually feeling it. You can describe what happened with clarity — but the emotion stays at arm\'s length.',
	'Displacement':
		'Redirecting an emotion from its real target to a safer one. Anger at a parent becomes snapping at a partner. The feeling is real — it\'s just aimed at the wrong person.',
	'Reaction Formation':
		'Expressing the opposite of what you truly feel. Over-the-top praise toward someone you resent, or exaggerated confidence masking deep insecurity.',
	'Repression':
		'Unconsciously pushing painful memories or feelings out of awareness. Unlike suppression (which is deliberate), repression happens automatically — you may not even know the memory exists.',
	'Regression':
		'Reverting to earlier, less mature behaviors under stress. Shutting down, throwing tantrums, or becoming helpless in situations where you normally function well.',
	'Suppression':
		'Consciously pushing unwanted thoughts or feelings aside. Unlike repression, you know the feeling is there — you\'re just choosing not to deal with it right now.',
	'Sublimation':
		'Channeling distressing emotions into productive outlets like art, exercise, or work. This is actually one of the healthier defense mechanisms — but it can become avoidance if the underlying pain is never addressed.',

	// Cognitive Distortions
	'Catastrophizing':
		'Expecting the worst-case outcome and treating it as inevitable. "If I mess this up, my life is over." The mind jumps to disaster without considering the many more likely outcomes in between.',
	'Black-and-White Thinking':
		'Seeing things in absolute terms with no middle ground. "I\'m either successful or a total failure." Reality almost always lives in the gray — but this pattern erases the gray entirely.',
	'Mind Reading':
		'Assuming you know what others are thinking without any real evidence. "She thinks I\'m stupid." You\'re not reading their mind — you\'re projecting your own fears onto them.',
	'Fortune Telling':
		'Predicting negative outcomes as though they\'re certain. "This will definitely go badly." It feels like realism, but it\'s actually anxiety wearing the mask of certainty.',
	'Overgeneralization':
		'Taking one event and drawing a sweeping conclusion. "This always happens" or "Nobody ever listens." One experience becomes an unbreakable law.',
	'Emotional Reasoning':
		'Believing something is true because it feels true. "I feel like a failure, so I must be one." Feelings are real, but they\'re not always accurate reflections of reality.',
	'Personalization':
		'Taking excessive responsibility for things that aren\'t your fault. Blaming yourself for others\' moods, reactions, or choices. Not everything is about you — and that\'s a relief.',
	'Should Statements':
		'Rigid internal rules about how you or others must behave. "I should be better than this." Shoulds create guilt when aimed at yourself and resentment when aimed at others.',
	'Labeling':
		'Reducing yourself or others to a single negative label based on a mistake or flaw. "I\'m useless" or "He\'s toxic." A label flattens a whole person into one word.',

	// Attachment Patterns
	'Anxious Attachment':
		'A relational pattern rooted in fear of abandonment. You may be hypervigilant about others\' responses, need frequent reassurance, and interpret silence or distance as rejection. It often develops when caregivers were inconsistently available.',
	'Avoidant Attachment':
		'A relational pattern of emotional distancing and self-reliance. "I don\'t need anyone." Closeness feels threatening, so you maintain independence at the cost of intimacy. Often develops when caregivers were emotionally unavailable.',
	'Fearful-Avoidant':
		'A push-pull pattern: you deeply want closeness but are terrified of it. You may alternate between reaching out and withdrawing. This often develops from early experiences where the source of comfort was also the source of fear.',
	'Codependency':
		'Your identity becomes fused with caring for or managing others. You may lose track of your own needs, feelings, and boundaries because you\'re so focused on someone else. Your worth becomes tied to being needed.',
	'People-Pleasing':
		'Also called the fawning response — automatically prioritizing others\' comfort to avoid conflict or maintain safety. You say yes when you mean no. It\'s a survival strategy that costs you your authentic self.',
	'Boundary Issues':
		'Difficulty asserting your own needs, saying no, or maintaining limits in relationships. You may feel responsible for others\' emotions or allow others to override your boundaries repeatedly.',

	// Trauma Responses
	'Hypervigilance':
		'A state of constant alertness, scanning the environment for threats. Your nervous system is stuck in "on" mode. It was adaptive during danger, but now it keeps you exhausted and unable to relax even in safe situations.',
	'Dissociation':
		'Feeling detached from yourself, your body, or reality. It can range from mild "zoning out" to feeling like you\'re watching your life from outside. It\'s the mind\'s circuit breaker when emotions become too overwhelming.',
	'Emotional Numbing':
		'A protective shutdown where you stop feeling — not just the bad, but the good too. It\'s the mind\'s way of surviving when feeling too much was dangerous. The cost is losing access to joy alongside the pain.',
	'Avoidance':
		'Systematically steering away from people, places, thoughts, or feelings associated with pain. It provides short-term relief but prevents processing and healing. The avoided thing often grows larger in its absence.',
	'Somatization':
		'Psychological distress expressed through the body — headaches, stomach problems, chronic tension, fatigue with no medical cause. The body carries what the mind won\'t let itself feel.',
	'Intrusive Thoughts':
		'Unwanted, distressing thoughts or images that force their way into awareness. They often replay past trauma or imagine future catastrophe. They don\'t define you — they\'re your mind\'s attempt to process unresolved pain.',

	// Maladaptive Coping
	'Rumination':
		'Repetitive, circular thinking that replays the same painful thoughts without moving toward resolution. It feels like problem-solving, but it\'s actually a loop. The mind chews on the wound instead of healing it.',
	'Self-Criticism as Motivation':
		'Using harsh self-talk as fuel — believing that if you\'re kind to yourself, you\'ll become lazy or complacent. "I need to be hard on myself to improve." It works short-term but erodes self-worth over time.',
	'Self-Sabotage':
		'Unconsciously undermining your own success or happiness. Procrastinating on important things, pushing people away when things get good, or creating chaos in moments of stability. Often driven by a belief that you don\'t deserve good things.',
	'Passive Aggression':
		'Expressing anger or resentment indirectly — through sarcasm, avoidance, silent treatment, or subtle obstruction. It usually develops when direct expression of anger felt unsafe.',

	// Deeper Patterns
	'Splitting':
		'Seeing people or situations in extremes — idealization followed by devaluation. Someone is either wonderful or terrible, with no in-between. It\'s a way of managing the complexity of relationships that feels too threatening to hold as nuanced.',
	'Low Self-Efficacy':
		'A deep belief that you can\'t handle things or make a difference. "What\'s the point of trying?" It\'s not laziness — it\'s learned helplessness from experiences where your efforts genuinely didn\'t matter.',
	'External Locus of Control':
		'The belief that your life is controlled by outside forces — luck, fate, other people — rather than your own choices. It can feel like realism, but it surrenders your agency.',
	'Maladaptive Perfectionism':
		'Setting impossibly high standards and tying your worth to meeting them. Any flaw becomes proof of failure. Unlike healthy striving, this pattern guarantees you can never feel good enough.',
	'Core Shame':
		'A deep, pervasive belief that you are fundamentally flawed or unworthy — not that you did something bad, but that you ARE bad. It sits beneath many other patterns and beliefs.',
	'Abandonment Schema':
		'A deep expectation that people will leave, betray, or become unavailable. It shapes how you enter and experience every relationship — often creating the very distance you fear.',
	'Mistrust Schema':
		'An expectation that others will hurt, manipulate, or take advantage of you. You stay guarded, test people, or avoid vulnerability. It was learned from real betrayals, but now it\'s applied universally.',
	'Defectiveness Schema':
		'A core belief that you are defective, broken, or fundamentally less than others. If people really knew you, they would reject you. It drives hiding, overcompensating, or withdrawing.',
	'Hopelessness':
		'A cognitive pattern where the future feels permanently bleak. "Nothing will ever change." It\'s not reality — it\'s depression speaking in the voice of truth.',
};
