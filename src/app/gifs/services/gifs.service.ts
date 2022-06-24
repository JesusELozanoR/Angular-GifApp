import { Injectable, Query } from '@angular/core';
import { Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '7Y3hp84AoB8MAY2NmhexKYqeI8Ya1sgK';
  private apiUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[]=[];

  public resultados: Gif[] = [];

  get historial(){
    
    return [...this._historial];
  }

  constructor (private http : HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('ultimaBusqueda')!) || [];
  };

  buscarGifs(query: string){
    
    query = query.toLowerCase();

    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.slice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', '10');
    

    this.http.get<SearchGifsResponse>(`${ this.apiUrl }/search`, { params } )
    .subscribe( ( resp ) =>{
      this.resultados = resp.data;
      localStorage.setItem('ultimaBusqueda', JSON.stringify(this.resultados));
    });
  }
}
