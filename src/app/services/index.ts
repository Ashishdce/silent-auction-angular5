import { AuthService } from './auth/auth.service';
import { CommonService } from './common/common.service';
import { FirestoreService } from './firestore/firestore.service';

export * from './auth/auth.service';
export * from './common/common.service';
export * from './firestore/firestore.service';

export const Services = [
    AuthService,
    CommonService,
    FirestoreService
];
