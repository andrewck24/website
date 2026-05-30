const tagProjection = `"tags": tags[]->{title, "slug": slug.current}`;
const coverImageProjection = `coverImage`;

export const getFeaturedNotesQuery = /* groq */ `
  *[_type == "note" && language == $locale && featured == true] | order(_createdAt asc) [0...5] {
    title,
    "slug": slug.current,
    description,
    date,
    featured,
    ${tagProjection},
    ${coverImageProjection}
  }
`;

export const getNoteQuery = /* groq */ `
  *[_type == "note" && language == $locale && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    description,
    date,
    featured,
    ${tagProjection},
    ${coverImageProjection},
    body
  }
`;

export const generateNoteStaticParamsQuery = /* groq */ `
  *[_type == "note" && defined(slug.current) && defined(language)] {
    "locale": language,
    "slug": slug.current
  }
`;

export const getFeaturedProjectsQuery = /* groq */ `
  *[_type == "project" && language == $locale && featured == true] | order(order asc) [0...5] {
    title,
    "slug": slug.current,
    description,
    date,
    featured,
    order,
    ${tagProjection},
    ${coverImageProjection}
  }
`;

export const getProjectQuery = /* groq */ `
  *[_type == "project" && language == $locale && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    description,
    date,
    featured,
    order,
    githubUrl,
    demoUrl,
    ${tagProjection},
    ${coverImageProjection},
    body
  }
`;

export const generateProjectStaticParamsQuery = /* groq */ `
  *[_type == "project" && defined(slug.current) && defined(language)] {
    "locale": language,
    "slug": slug.current
  }
`;

export const getAllNotesQuery = /* groq */ `
  *[_type == "note" && language == $locale] | order(_createdAt asc) {
    title,
    "slug": slug.current,
    description,
    date,
    featured,
    _updatedAt,
    ${tagProjection},
    ${coverImageProjection}
  }
`;

export const getAllProjectsQuery = /* groq */ `
  *[_type == "project" && language == $locale] | order(order asc) {
    title,
    "slug": slug.current,
    description,
    date,
    featured,
    order,
    _updatedAt,
    ${tagProjection},
    ${coverImageProjection}
  }
`;

export const getAvailableLocalesQuery = /* groq */ `
  *[_type == $type && slug.current == $slug && defined(language)].language
`;

export const getAboutQuery = /* groq */ `
  *[_type == "about" && language == $locale][0] {
    title,
    body
  }
`;

export const getAvailableAboutLocalesQuery = /* groq */ `
  *[_type == "about" && defined(language)].language
`;

export const getLlmsNotesQuery = /* groq */ `
  *[_type == "note" && language == "en" && defined(slug.current)] | order(_createdAt asc) {
    title,
    "slug": slug.current,
    description
  }
`;

export const getLlmsProjectsQuery = /* groq */ `
  *[_type == "project" && language == "en" && defined(slug.current)] | order(order asc) {
    title,
    "slug": slug.current,
    description
  }
`;
