import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { CyclosService } from '../services/cyclos.service'; // Import CyclosService
import { PaypalService } from '../services/paypal.service'; // Import PaypalService

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    CyclosService, // Add CyclosService to providers
    PaypalService, // Add PaypalService to providers
  ],
})
export class AppModule {}
