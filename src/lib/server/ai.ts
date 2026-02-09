import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const MODEL = 'gpt-4o';

export async function extractBeliefsFromText(text: string): Promise<string[]> {
	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: 'system',
				content: `You are a compassionate psychological analyst. Your task is to identify negative or limiting beliefs embedded in the user's journal entry. Extract beliefs that are:
- Self-limiting statements about identity ("I am not enough")
- Assumptions about how the world works ("People always leave")
- Conditional worth statements ("If I fail, I lose my value")
- Beliefs about deserving ("I don't deserve good things")

Return ONLY a JSON array of belief strings. Each belief should be a concise first-person statement. Extract 1-5 beliefs. If no clear negative beliefs are present, return an empty array.`
			},
			{ role: 'user', content: text }
		],
		response_format: { type: 'json_object' },
		temperature: 0.3
	});

	try {
		const parsed = JSON.parse(response.choices[0].message.content || '{}');
		return parsed.beliefs || [];
	} catch {
		return [];
	}
}

export async function generateAffirmation(
	belief: string,
	origins: { question: string; response: string }[],
	functionalBelief?: string
): Promise<string> {
	const originContext = origins
		.map((o) => `Q: ${o.question}\nA: ${o.response}`)
		.join('\n\n');

	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: 'system',
				content: `You are a compassionate guide helping someone create a personalized affirmation. The affirmation must:
- Directly counter the specific negative belief
- Feel realistic and grounded, not forced or overly positive
- Acknowledge the person's worthiness and agency
- Be informed by the belief's origin story
- Be 1-3 sentences maximum
- Use first-person language

Do NOT be generic. This must feel true and personal.`
			},
			{
				role: 'user',
				content: `Negative belief: "${belief}"

Origin context:
${originContext}

${functionalBelief ? `They are working toward this new belief: "${functionalBelief}"` : ''}

Create a personalized affirmation.`
			}
		],
		temperature: 0.7
	});

	return response.choices[0].message.content || '';
}

export async function generateMythicStory(
	belief: string,
	origins: { question: string; response: string }[],
	functionalBelief?: string
): Promise<{ title: string; content: string }> {
	const originContext = origins
		.map((o) => `Q: ${o.question}\nA: ${o.response}`)
		.join('\n\n');

	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: 'system',
				content: `You are a mythic storyteller and symbolic narrative creator. Your task is to write a short parable or mythic story that speaks to the user's struggle at a deep, subconscious level.

The story must:
- Be mythical, archetypal, and symbolic (think fairy tales, ancient parables, hero's journey)
- Feature a character who mirrors the user's struggle without being literally autobiographical
- Show the character encountering the wound, understanding its origin, and transforming through it
- Use rich imagery, metaphor, and symbolic language
- Reframe the user as someone who overcomes, integrates, and transforms
- Avoid direct preaching, instruction, or clinical language
- Be 300-600 words
- Feel meaningful, beautiful, and memorable

Think of this as: inner child healing through myth, cognitive reframing through story, psychological transformation through symbolism.

Return JSON with "title" and "content" fields.`
			},
			{
				role: 'user',
				content: `The person carries this belief: "${belief}"

Their origin story:
${originContext}

${functionalBelief ? `They are moving toward: "${functionalBelief}"` : ''}

Write a mythic story that speaks to their transformation.`
			}
		],
		response_format: { type: 'json_object' },
		temperature: 0.9
	});

	try {
		const parsed = JSON.parse(response.choices[0].message.content || '{}');
		return { title: parsed.title || 'Untitled Story', content: parsed.content || '' };
	} catch {
		return { title: 'Untitled Story', content: response.choices[0].message.content || '' };
	}
}

export async function assistOriginInquiry(
	belief: string,
	existingResponses: { question: string; response: string }[]
): Promise<string> {
	const context = existingResponses
		.map((r) => `Q: ${r.question}\nA: ${r.response}`)
		.join('\n\n');

	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: 'system',
				content: `You are a gentle, insightful guide helping someone trace the origin of a limiting belief. Based on their responses so far, provide a brief, compassionate reflection (2-4 sentences) that:
- Validates what they've shared
- Gently illuminates a pattern or connection they may not have seen
- Encourages deeper exploration without pushing

The goal is context, not blame. Help them see that beliefs were learned, not innate truths.`
			},
			{
				role: 'user',
				content: `Belief: "${belief}"

Responses so far:
${context || 'None yet - they are just beginning.'}

Provide a gentle reflection.`
			}
		],
		temperature: 0.7
	});

	return response.choices[0].message.content || '';
}

export async function generateJournalInsights(content: string): Promise<string> {
	const response = await openai.chat.completions.create({
		model: MODEL,
		messages: [
			{
				role: 'system',
				content: `You are a compassionate observer. Read the journal entry and provide a brief, gentle insight (2-3 sentences) that:
- Reflects back what you notice without judgment
- Names any emotional themes present
- Offers a small observation the writer might find meaningful

Do not give advice. Just mirror and illuminate.`
			},
			{ role: 'user', content }
		],
		temperature: 0.6
	});

	return response.choices[0].message.content || '';
}
