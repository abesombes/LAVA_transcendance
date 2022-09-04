import { Injectable } from '@nestjs/common';

export interface Movie {
  id: number;
  name: string;
  year: number;
}

@Injectable()
export class AppService {
  private movies: Movie[] = [
    { id: 1, name: 'Star Wars: The Force Awakens', year: 20150 },
    { id: 2, name: 'Star Wars: The Last Jedi', year: 2017 },
    { id: 3, name: 'Star Wars: The Rise of Skywalker', year: 42 },
  ];

  getMovies(): Movie[] {
    return this.movies;
  }
}
