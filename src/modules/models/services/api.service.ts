import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OPENROUTER_REQUEST_URL } from 'src/config/global.config';

@Injectable()
export class ApiService {
  constructor(private readonly configService: ConfigService) {}

  private async getApiData(url: string, params?: object) {
    try {
      const { data } = await axios.get(url, {
        params,
      });
      return data;
    } catch (ex) {
      throw new UnprocessableEntityException(ex.response.data.errors);
    }
  }

  private async sendApiData(url: string, params: object) {
    try {
      const { data } = await axios.post(url, params, {});
      return data;
    } catch (ex) {
      console.log(ex?.response);
      throw new UnprocessableEntityException(ex?.response?.data?.errors);
    }
  }

  async getDataFromOpenrouter(){
    return (await this.getApiData(this.configService.get(OPENROUTER_REQUEST_URL))).data
  }
}
