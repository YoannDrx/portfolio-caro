import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import html from 'remark-html';
import { remark } from 'remark';

const postsDirectory = path.join(process.cwd(), 'posts');

// Récupère les données de tous les articles
export async function getSortedPostsData() { 
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Utilisation de remark pour transformer le markdown en HTML
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      id,
      contentHtml,
      tags: matterResult.data.tags || [],
      ...matterResult.data,
    };
  }));


  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else {
      return 1;
    }
  });
}

// Récupère les id de tous les articles
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Retourne un tableau qui contient tous les slugs (identifiants) des articles
  return fileNames.map(fileName => {
    return {
      params: {
        blogId: fileName.replace(/\.md$/, '')
      }
    };
  });
}

// Récupère les données d'un article en fonction de son id
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Utilise gray-matter pour analyser les métadonnées du post
  const matterResult = matter(fileContents);

  // Utilise remark pour convertir le markdown en HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data
  };
}
