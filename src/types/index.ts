export interface Article{articleId:string;title:string;description:string;source:string;category:string;publishedAt:string;image:string;location:string;storyId:string;tags:string[]}
export interface Story{storyId:string;title:string;summary:string;category:string;location:string;sources:string[];articles:Article[];timeline:{time:string;label:string;articleId:string}[];updates:{field:string;prev:string;next:string}[]}
export interface User{name:string;email:string}
