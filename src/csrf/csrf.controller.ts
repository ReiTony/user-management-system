import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Get CSRF token route
@ApiTags('CSRF')
@Controller('api')
export class CsrfController {
  @ApiOperation({
    summary: 'Get CSRF token',
    description:
      'Call this endpoint to retrieve the CSRF token. The token will be included in a cookie named `XSRF-TOKEN`. Use this token in the `X-XSRF-TOKEN` header for all subsequent requests requiring CSRF protection.',
  })
  @ApiResponse({
    status: 200,
    description: 'CSRF token retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  })
  @Get('csrf-token')
  getCsrfToken(@Req() req): any {
    return { token: req.csrfToken() }; 
  }
}
