import dotenv from 'dotenv';
import { buildEmbed } from '../services/embedding';
import { VectorService } from '../services/vector';
import { Chunk } from '../types';
import { getEmbeddingModel } from '../instances/embeddingModel';

dotenv.config();

const seedData = [
  {
    id: 'armenia1',
    text: 'Armenia is a mountainous country in the South Caucasus region. It is known for its ancient history, being one of the first nations to adopt Christianity as a state religion in 301 AD.',
    metadata: { source: 'wiki' },
  },
  {
    id: 'armenia2',
    text: 'Armenian cuisine is famous for its variety and flavor. Traditional dishes include khorovats (barbecue), dolma (stuffed grape leaves), and lavash (traditional flatbread).',
    metadata: { source: 'culture' },
  },
  {
    id: 'armenia3',
    text: 'Mount Ararat, though located in modern-day Turkey, is a national symbol of Armenia and features prominently in Armenian culture and art.',
    metadata: { source: 'geography' },
  },
  {
    id: 'armenia4',
    text: 'The Armenian Genocide of 1915 resulted in the death of 1.5 million Armenians. It is commemorated annually on April 24th.',
    metadata: { source: 'history' },
  },
  {
    id: 'armenia5',
    text: 'Yerevan, the capital of Armenia, is one of the oldest continuously inhabited cities in the world, founded in 782 BCE.',
    metadata: { source: 'cities' },
  },
  {
    id: 'tech1',
    text: 'Armenia has a growing technology sector, with many startups and IT companies. The government supports tech education and innovation.',
    metadata: { source: 'economy' },
  },
  {
    id: 'culture1',
    text: 'Armenian alphabet was created by Mesrop Mashtots in 405 AD and consists of 39 letters. It is unique and used only for the Armenian language.',
    metadata: { source: 'language' },
  },
  {
    id: 'nature1',
    text: 'Lake Sevan is one of the largest high-altitude freshwater lakes in the world, located in Armenia at 1,900 meters above sea level.',
    metadata: { source: 'nature' },
  },
  {
    id: 'music1',
    text: 'Armenian music combines indigenous folk music with classical and contemporary styles. The duduk, an ancient double-reed instrument, is recognized by UNESCO.',
    metadata: { source: 'arts' },
  },
  {
    id: 'diaspora1',
    text: 'The Armenian diaspora is estimated to be around 7-10 million people worldwide, significantly larger than the population of Armenia itself (about 3 million).',
    metadata: { source: 'demographics' },
  },
];

const seed = async () => {
  console.log('Starting seed process...');

  const embed = buildEmbed(await getEmbeddingModel());
  const vectorService = await VectorService.getVectorService();

  const allChunks: Chunk[] = [];

  for (const doc of seedData) {
    console.log(`Processing document: ${doc.id}`);

    const chunks = [doc.text];
    const embeddings = await embed(chunks);

    for (let i = 0; i < chunks.length; i++) {
      allChunks.push({
        id: `${doc.id}#chunk${i}`,
        text: chunks[i],
        metadata: doc.metadata,
        vector: embeddings[i],
      });
    }
  }

  await vectorService.save(allChunks);
  console.log(
    `Seeded ${allChunks.length} chunks from ${seedData.length} documents`,
  );
};

seed().catch(console.error);
