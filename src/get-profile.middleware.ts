import { Injectable, NestMiddleware } from '@nestjs/common';
import { Profile } from './profiles/entities/profile.entity';

@Injectable()
export class GetProfileMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const profile = await Profile.findOne({where: {id: req.get('profile_id') || 0}})
    if(!profile) return res.status(401).end()
    req.profile = profile
    next()
  }
}
