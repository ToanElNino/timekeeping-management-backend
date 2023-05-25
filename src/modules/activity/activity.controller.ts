import {Controller, Get, HttpStatus, Query, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {ActivityBaseResponsePagination} from './response/ActivityBaseResponsePagination.dto';
import {PageOptionsDto} from '../../shared/Request/baseRequest.dto';
import {UserWalletRequestDto} from '../../shared/Request/UserWalletRequest.dto';
import {ActivityService} from './activity.service';
import {EmptyObject} from '../../shared/response/emptyObject.dto';
import {PaginationResponse} from '../../config/rest/paginationResponse';
import {Transaction} from '../../database/entities';
import {FilterTransactionRequest} from './request/filter-transaction.dto';
// import {JwtAuthGuard} from '../auth/jwt-auth.guard';
@Controller('activities')
export class ActivityController {
  constructor(private activityService: ActivityService) {}
  @Get('')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['activities'],
    operationId: '',
    summary: 'Get list of activities.',
    description: 'Get list of activities.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ActivityBaseResponsePagination,
  })
  async getAllActivities(
    @Query() pageOptions: PageOptionsDto,
    @Query() filter: FilterTransactionRequest
  ): Promise<PaginationResponse<Transaction>> {
    return await this.activityService.listAllTransaction(pageOptions, filter);
  }
}
