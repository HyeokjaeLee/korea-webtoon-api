import { Controller, Get } from '@nestjs/common';
import { UpdateInfoService } from './update-info.service';

@Controller()
export class UpdateInfoController {
  constructor(private readonly updatedInfoService: UpdateInfoService) {
    updatedInfoService.updateWebtoonsCollection();
    const ONE_HOUR = 1000 * 60 * 60;
    setInterval(() => {
      updatedInfoService.updateWebtoonsCollection();
    }, ONE_HOUR);
  }
  @Get()
  async findAll() {
    return await this.updatedInfoService.findAll();
  }
}
