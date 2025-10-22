dracarys@pop-os:~/toilet-monitoring$ npm run type-check

> toilet-monitoring@1.0.0 type-check
> tsc --noEmit

.next/types/app/api/templates/[id]/route.ts:12:13 - error TS2344: Type 'OmitWithTag<typeof import("/DataPopOS/toilet-monitoring/src/app/api/templates/[id]/route"), "POST" | "GET" | "PATCH" | "DELETE" | "config" | "generateStaticParams" | "revalidate" | "dynamic" | ... 7 more ... | "PUT", "">' does not satisfy the constraint '{ [x: string]: never; }'.
Property 'getDefaultTemplate' is incompatible with index signature.
Type '() => Promise<any>' is not assignable to type 'never'.

12 checkFields<Diff<{
~~~~~~
13 GET?: Function
~~~~~~~~~~~~~~~~
...
29

30 }, TEntry, ''>>()
~~~~~~~~~~~~~~

.next/types/app/api/templates/[id]/route.ts:49:7 - error TS2344: Type '{ **tag**: "GET"; **param_position**: "second"; **param_type**: RouteParams; }' does not satisfy the constraint 'ParamCheck<RouteContext>'.
The types of '**param_type**.params' are incompatible between these types.
Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

49 {
~
50 **tag**: 'GET'
~~~~~~~~~~~~~~~~~~~~~~
...
52 **param_type**: SecondArg<MaybeField<TEntry, 'GET'>>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
53 },
~~~~~~~

.next/types/validator.ts:288:31 - error TS2344: Type 'typeof import("/DataPopOS/toilet-monitoring/src/app/api/templates/[id]/route")' does not satisfy the constraint 'RouteHandlerConfig<"/api/templates/[id]">'.
Types of property 'GET' are incompatible.
Type '(request: NextRequest, { params }: RouteParams) => Promise<NextResponse<{ error: string; }> | NextResponse<{ success: boolean; data: any; }>>' is not assignable to type '(request: NextRequest, context: { params: Promise<{ id: string; }>; }) => void | Response | Promise<void | Response>'.
Types of parameters '\_\_1' and 'context' are incompatible.
Type '{ params: Promise<{ id: string; }>; }' is not assignable to type 'RouteParams'.
Types of property 'params' are incompatible.
Property 'id' is missing in type 'Promise<{ id: string; }>' but required in type '{ id: string; }'.

288 type **Check = **IsExpected<typeof handler>
~~~~~~~~~~~~~~

src/app/api/templates/[id]/route.ts:11:5
11 id: string;
~~
'id' is declared here.

backup-20251021-210524/InspectionForm.backup.tsx:9:10 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecordInsert'.

9 import { InspectionRecordInsert, InspectionTemplateInsert, LocationInsert } from '@/infrastructure/database/supabase';
~~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:9:34 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionTemplateInsert'.

9 import { InspectionRecordInsert, InspectionTemplateInsert, LocationInsert } from '@/infrastructure/database/supabase';
~~~~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:9:60 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'LocationInsert'.

9 import { InspectionRecordInsert, InspectionTemplateInsert, LocationInsert } from '@/infrastructure/database/supabase';
~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:11:32 - error TS2307: Cannot find module './UIModeSwitcher' or its corresponding type declarations.

11 import { UIModeSwitcher } from './UIModeSwitcher';
~~~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:12:35 - error TS2307: Cannot find module './PhotoModeSwitcher' or its corresponding type declarations.

12 import { PhotoModeSwitcher } from './PhotoModeSwitcher';
~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:13:38 - error TS2307: Cannot find module './LocationModeSwitcher' or its corresponding type declarations.

13 import { LocationModeSwitcher } from './LocationModeSwitcher';
~~~~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:14:33 - error TS2307: Cannot find module './ComponentRating' or its corresponding type declarations.

14 import { ComponentRating } from './ComponentRating';
~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:15:30 - error TS2307: Cannot find module './CommentModal' or its corresponding type declarations.

15 import { CommentModal } from './CommentModal';
~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:16:30 - error TS2307: Cannot find module './PhotoCapture' or its corresponding type declarations.

16 import { PhotoCapture } from './PhotoCapture';
~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:17:30 - error TS2307: Cannot find module './PhotoPreview' or its corresponding type declarations.

17 import { PhotoPreview } from './PhotoPreview';
~~~~~~~~~~~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:498:28 - error TS7006: Parameter 'rating' implicitly has an 'any' type.

498 onChange={(rating) => updateResponse(component.id, { rating })}
~~~~~~

backup-20251021-210524/InspectionForm.backup.tsx:516:31 - error TS7006: Parameter 'file' implicitly has an 'any' type.

516 onCapture={(file) => addPhoto(file, component.id)}
~~~~

backup-20251021-210524/inspection.types.aligned.ts:7:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecord'.

7 InspectionRecord,
~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.aligned.ts:8:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecordInsert'.

8 InspectionRecordInsert,
~~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.aligned.ts:9:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecordUpdate'.

9 InspectionRecordUpdate,
~~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.aligned.ts:10:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionTemplate'.

10 InspectionTemplate,
~~~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.aligned.ts:11:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'Location'.

11 Location,
~~~~~~~~

backup-20251021-210524/inspection.types.aligned.ts:12:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'Photo'.

12 Photo,
~~~~~

backup-20251021-210524/inspection.types.backup.ts:7:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecord'.

7 InspectionRecord,
~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.backup.ts:8:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecordInsert'.

8 InspectionRecordInsert,
~~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.backup.ts:9:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecordUpdate'.

9 InspectionRecordUpdate,
~~~~~~~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.backup.ts:10:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionTemplate'.

10 InspectionTemplate,
~~~~~~~~~~~~~~~~~~

backup-20251021-210524/inspection.types.backup.ts:11:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'Location'.

11 Location,
~~~~~~~~

backup-20251021-210524/inspection.types.backup.ts:12:3 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'Photo'.

12 Photo,
~~~~~

src/app/api/inspections/route.ts:7:20 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecordInsert'.

7 import { supabase, InspectionRecordInsert } from '@/infrastructure/database/supabase';
~~~~~~~~~~~~~~~~~~~~~~

src/app/api/inspections/route.ts:53:25 - error TS2339: Property 'geolocation' does not exist on type 'CreateInspectionDTO'.

53 geolocation: body.geolocation as any || null, // JSONB
~~~~~~~~~~~

src/app/dashboard/inspection/page.tsx:26:8 - error TS2741: Property 'templateId' is missing in type '{ userId: string; onSuccess: (inspectionId: string) => void; onCancel: () => void; }' but required in type 'InspectionFormProps'.

26 <InspectionForm userId={user.id} onSuccess={handleSuccess} onCancel={handleCancel} />
~~~~~~~~~~~~~~

src/presentation/components/features/Inspection/InspectionForm.tsx:78:3
78 templateId: string;
~~~~~~~~~~
'templateId' is declared here.

src/app/dashboard/inspection/success/page.tsx:10:10 - error TS2724: '"@/infrastructure/services/inspection.service"' has no exported member named 'inspectionService'. Did you mean 'typedInspectionService'?

10 import { inspectionService } from '@/infrastructure/services/inspection.service';
~~~~~~~~~~~~~~~~~

src/infrastructure/services/inspection.service.ts:5:14
5 export const typedInspectionService = {
~~~~~~~~~~~~~~~~~~~~~~
'typedInspectionService' is declared here.

src/app/dashboard/inspection/success/page.tsx:12:10 - error TS2459: Module '"@/core/types/inspection.types"' declares 'InspectionRecord' locally, but it is not exported.

12 import { InspectionRecord } from '@/core/types/inspection.types';
~~~~~~~~~~~~~~~~

src/core/types/inspection.types.ts:8:3
8 InspectionRecord,
~~~~~~~~~~~~~~~~
'InspectionRecord' is declared here.

src/app/dashboard/inspection/success/page.tsx:63:40 - error TS18046: 'response' is of type 'unknown'.

63 .filter(([_, response]) => response.rating <= 2)
~~~~~~~~

src/app/dashboard/inspection/success/page.tsx:171:29 - error TS7053: Element implicitly has an 'any' type because expression of type '1 | 4 | 3 | 5 | 2' can't be used to index type 'Record<RatingValue, number>'.
Property '1' does not exist on type 'Record<RatingValue, number>'.

171 const count = stats.breakdown[rating as 1 | 2 | 3 | 4 | 5];
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/app/dashboard/layout.tsx:78:56 - error TS2339: Property 'role' does not exist on type 'User'.

78 <p className={styles.userRole}>{user.role}</p>
~~~~

src/app/dashboard/locations/create/page.tsx:127:19 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.

127 value={formData.building}
~~~~~

node_modules/.pnpm/@types+react@18.3.26/node_modules/@types/react/index.d.ts:3567:9
3567 value?: string | readonly string[] | number | undefined;
~~~~~
The expected type comes from property 'value' which is declared here on type 'DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>'

src/app/dashboard/locations/create/page.tsx:157:19 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.

157 value={formData.code}
~~~~~

node_modules/.pnpm/@types+react@18.3.26/node_modules/@types/react/index.d.ts:3411:9
3411 value?: string | readonly string[] | number | undefined;
~~~~~
The expected type comes from property 'value' which is declared here on type 'DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>'

src/app/dashboard/locations/create/page.tsx:168:19 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
Type 'null' is not assignable to type 'string | number | readonly string[] | undefined'.

168 value={formData.floor}
~~~~~

node_modules/.pnpm/@types+react@18.3.26/node_modules/@types/react/index.d.ts:3411:9
3411 value?: string | readonly string[] | number | undefined;
~~~~~
The expected type comes from property 'value' which is declared here on type 'DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>'

src/app/dashboard/locations/print-qr/page.tsx:48:13 - error TS2345: Argument of type '() => () => HTMLStyleElement' is not assignable to parameter of type 'EffectCallback'.
Type '() => HTMLStyleElement' is not assignable to type 'void | Destructor'.
Type '() => HTMLStyleElement' is not assignable to type 'Destructor'.
Type 'HTMLStyleElement' is not assignable to type 'void | { [UNDEFINED_VOID_ONLY]: never; }'.

48 useEffect(() => {
~~~~~~~

src/app/dashboard/scan/page.tsx:11:33 - error TS2306: File '/DataPopOS/toilet-monitoring/src/infrastructure/services/location.service.ts' is not a module.

11 import { locationService } from '@/infrastructure/services/location.service';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/app/dashboard/scan/page.tsx:12:10 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'LocationData'. Did you mean 'GeolocationData'?

12 import { LocationData } from '@/core/types/inspection.types';
~~~~~~~~~~~~

src/app/inspection/success/page.tsx:10:10 - error TS2724: '"@/infrastructure/services/inspection.service"' has no exported member named 'inspectionService'. Did you mean 'typedInspectionService'?

10 import { inspectionService } from '@/infrastructure/services/inspection.service';
~~~~~~~~~~~~~~~~~

src/infrastructure/services/inspection.service.ts:5:14
5 export const typedInspectionService = {
~~~~~~~~~~~~~~~~~~~~~~
'typedInspectionService' is declared here.

src/app/inspection/success/page.tsx:11:10 - error TS2459: Module '"@/core/types/inspection.types"' declares 'InspectionRecord' locally, but it is not exported.

11 import { InspectionRecord } from '@/core/types/inspection.types';
~~~~~~~~~~~~~~~~

src/core/types/inspection.types.ts:8:3
8 InspectionRecord,
~~~~~~~~~~~~~~~~
'InspectionRecord' is declared here.

src/app/inspection/success/page.tsx:67:5 - error TS2571: Object is of type 'unknown'.

67 Object.values(inspection.responses).reduce((sum, r) => sum + r.rating, 0) /
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/app/inspection/success/page.tsx:67:66 - error TS18046: 'r' is of type 'unknown'.

67 Object.values(inspection.responses).reduce((sum, r) => sum + r.rating, 0) /
~

src/core/dtos/CreateInspectionDTO.ts:2:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

2 import { Json } from '@/core/types/database.types';
~~~~

src/core/entities/Assessment.ts:2:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

2 import { Json } from '@/core/types/database.types';
~~~~

src/core/entities/Inspection.ts:1:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

1 import { Json } from '@/core/types/database.types';
~~~~

src/core/entities/InspectionTemplate.ts:2:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

2 import { Json } from '@/core/types/database.types';
~~~~

src/core/entities/Location.ts:1:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

1 import { Json } from '@/core/types/database.types';
~~~~

src/core/repositories/IInspectionRepository.ts:3:10 - error TS2305: Module '"@/core/entities/Inspection"' has no exported member 'InspectionEntity'.

3 import { InspectionEntity } from '@/core/entities/Inspection';
~~~~~~~~~~~~~~~~

src/core/repositories/IInspectionRepository.ts:4:41 - error TS2307: Cannot find module '@/core/use-cases/GetInspectionHistory' or its corresponding type declarations.

4 import { GetInspectionHistoryDTO } from '@/core/use-cases/GetInspectionHistory';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/core/repositories/IInspectionRepository.ts:16:10 - error TS2305: Module '"@/core/entities/User"' has no exported member 'UserEntity'.

16 import { UserEntity } from '@/core/entities/User';
~~~~~~~~~~

src/core/repositories/IPhotoRepository.ts:2:23 - error TS2307: Cannot find module '@/core/entities/Photo' or its corresponding type declarations.

2 import { Photo } from '@/core/entities/Photo';
~~~~~~~~~~~~~~~~~~~~~~~

src/core/types/database.types.ts:7:26 - error TS2307: Cannot find module '@/supabase.types' or its corresponding type declarations.

7 import { Database } from '@/supabase.types';
~~~~~~~~~~~~~~~~~~

src/core/types/index.ts:15:1 - error TS2308: Module './database.types' has already exported a member named 'UserRole'. Consider explicitly re-exporting to resolve the ambiguity.

15 export \* from './enums';

```

src/core/use-cases/GetCurrentUserUseCase.ts:4:10 - error TS2305: Module '"../entities/User"' has no exported member 'UserEntity'.

4 import { UserEntity } from '../entities/User';
        ~~~~~~~~~~

src/core/use-cases/UploadPhoto.ts:31:71 - error TS2554: Expected 1 arguments, but got 2.

31     const photoUrl = await this.photoRepository.upload(dto.photoData, dto.metadata);
                                                                      ~~~~~~~~~~~~

src/infrastructure/database/repositories/InspectionTemplateRepository.ts:4:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

4 import { Json } from '@/core/types/database.types';
        ~~~~

src/infrastructure/database/repositories/SupabaseLocationRepository.ts:7:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

7 import { Json } from '@/core/types/database.types';
        ~~~~

src/infrastructure/database/supabase.ts:7:26 - error TS2307: Cannot find module '@/supabase.types' or its corresponding type declarations.

7 import { Database } from '@/supabase.types';
                        ~~~~~~~~~~~~~~~~~~

src/infrastructure/services/cloudinary.service.ts:7:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'CloudinaryUploadResponse'.

7   CloudinaryUploadResponse,
 ~~~~~~~~~~~~~~~~~~~~~~~~

src/infrastructure/services/cloudinary.service.ts:8:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'PhotoUploadItem'.

8   PhotoUploadItem,
 ~~~~~~~~~~~~~~~

src/infrastructure/services/cloudinary.service.ts:9:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'PhotoMetadata'.

9   PhotoMetadata,
 ~~~~~~~~~~~~~

src/infrastructure/services/index.ts:5:10 - error TS2724: '"./inspection.service"' has no exported member named 'inspectionService'. Did you mean 'typedInspectionService'?

5 export { inspectionService } from './inspection.service';
        ~~~~~~~~~~~~~~~~~

src/infrastructure/services/inspection.service.ts:5:14
 5 export const typedInspectionService = {
                ~~~~~~~~~~~~~~~~~~~~~~
 'typedInspectionService' is declared here.

src/infrastructure/services/index.ts:7:33 - error TS2306: File '/DataPopOS/toilet-monitoring/src/infrastructure/services/location.service.ts' is not a module.

7 export { locationService } from './location.service';
                               ~~~~~~~~~~~~~~~~~~~~

src/infrastructure/services/inspection.service.ts:2:10 - error TS2724: '"./inspection.service"' has no exported member named 'inspectionService'. Did you mean 'typedInspectionService'?

2 import { inspectionService } from './inspection.service';
        ~~~~~~~~~~~~~~~~~

src/infrastructure/services/inspection.service.ts:5:14
 5 export const typedInspectionService = {
                ~~~~~~~~~~~~~~~~~~~~~~
 'typedInspectionService' is declared here.

src/infrastructure/services/notification.service.ts:15:13 - error TS2552: Cannot find name 'NotificationAction'. Did you mean 'NotificationOptions'?

15   actions?: NotificationAction[];
            ~~~~~~~~~~~~~~~~~~

src/infrastructure/services/notification.service.ts:88:11 - error TS2353: Object literal may only specify known properties, and 'actions' does not exist in type 'NotificationOptions'.

88           actions: options.actions || [],
          ~~~~~~~

src/infrastructure/services/template.service.ts:3:10 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'InspectionTemplate'. Did you mean 'InspectionTemplateFields'?

3 import { InspectionTemplate } from '@/core/types/inspection.types';
        ~~~~~~~~~~~~~~~~~~

src/infrastructure/storage/CloudinaryPhotoRepository.ts:2:28 - error TS2305: Module '"@/core/repositories/IPhotoRepository"' has no exported member 'PhotoMetadata'.

2 import { IPhotoRepository, PhotoMetadata } from '@/core/repositories/IPhotoRepository';
                          ~~~~~~~~~~~~~

src/infrastructure/storage/CloudinaryPhotoRepository.ts:13:9 - error TS2416: Property 'upload' in type 'CloudinaryPhotoRepository' is not assignable to the same property in base type 'IPhotoRepository'.
Type '(photoData: string, metadata: PhotoMetadata) => Promise<string>' is not assignable to type '(photoData: { file_url: string; file_name?: string | null | undefined; file_size?: number | null | undefined; mime_type?: string | null | undefined; caption?: string | null | undefined; inspection_id?: string | ... 1 more ... | undefined; location_id?: string | ... 1 more ... | undefined; uploaded_by?: string | ... ...'.
 Target signature provides too few arguments. Expected 2 or more, but got 1.

13   async upload(photoData: string, metadata: PhotoMetadata): Promise<string> {
        ~~~~~~

src/lib/constants/inspection.constants.ts:17:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

17     description: 'Cleanliness and condition of the toilet bowl',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:27:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

27     description: 'Overall floor cleanliness and dryness',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:37:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

37     description: 'Walls, tiles, and surfaces condition',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:47:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

47     description: 'Sink cleanliness and water flow',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:57:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

57     description: 'Soap availability and dispenser condition',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:67:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

67     description: 'Tissue availability and dispenser condition',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:77:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

77     description: 'Trash bin cleanliness and fullness',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:87:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

87     description: 'Door condition and lock functionality',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:97:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

97     description: 'Air circulation and ventilation system',
    ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:107:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

107     description: 'Light brightness and functionality',
     ~~~~~~~~~~~

src/lib/constants/inspection.constants.ts:117:5 - error TS2353: Object literal may only specify known properties, and 'description' does not exist in type 'InspectionComponent'.

117     description: 'Overall smell and air freshness',
     ~~~~~~~~~~~

src/lib/di.ts:19:10 - error TS2305: Module '"@/core/use-cases/CreateLocation"' has no exported member 'CreateLocation'.

19 import { CreateLocation } from '@/core/use-cases/CreateLocation';
         ~~~~~~~~~~~~~~

src/lib/di.ts:20:10 - error TS2305: Module '"@/core/use-cases/UpdateLocation"' has no exported member 'UpdateLocation'.

20 import { UpdateLocation } from '@/core/use-cases/UpdateLocation';
         ~~~~~~~~~~~~~~

src/lib/utils/geolocation.utils.ts:61:13 - error TS2322: Type 'string' is not assignable to type 'number'.

61             timestamp: new Date().toISOString(),
            ~~~~~~~~~

src/lib/utils/geolocation.utils.ts:70:13 - error TS2322: Type 'string' is not assignable to type 'number'.

70             timestamp: new Date().toISOString(),
            ~~~~~~~~~

src/lib/utils/geolocation.utils.ts:119:7 - error TS2353: Object literal may only specify known properties, and 'address' does not exist in type 'Partial<GeolocationData>'.

119       address: formattedAddress.street,
       ~~~~~~~

src/lib/utils/geolocation.utils.ts:275:11 - error TS2322: Type 'string' is not assignable to type 'number'.

275           timestamp: new Date().toISOString(),
           ~~~~~~~~~

src/core/types/inspection.types.ts:80:3
 80   timestamp: number;
      ~~~~~~~~~
 The expected type comes from property 'timestamp' which is declared here on type 'GeolocationData'

src/lib/utils/geolocation.utils.ts:282:11 - error TS2322: Type 'string' is not assignable to type 'number'.

282           timestamp: new Date().toISOString(),
           ~~~~~~~~~

src/core/types/inspection.types.ts:80:3
 80   timestamp: number;
      ~~~~~~~~~
 The expected type comes from property 'timestamp' which is declared here on type 'GeolocationData'

src/lib/utils/rating.utils.ts:8:3 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'InspectionStatus'. Did you mean 'InspectionUIState'?

8   InspectionStatus,
 ~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:32:19 - error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:32:19 - error TS2531: Object is possibly 'null'.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:32:44 - error TS2769: No overload matches this call.
Overload 1 of 3, '(callbackfn: (previousValue: RatingValue | null, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => RatingValue | null, initialValue: RatingValue | null): RatingValue | null', gave the following error.
 Type 'string' is not assignable to type 'RatingValue | null'.
Overload 2 of 3, '(callbackfn: (previousValue: number, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => number, initialValue: number): number', gave the following error.
 Type 'string' is not assignable to type 'number'.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                                           ~~~~~

node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1489:24
 1489     reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 The expected type comes from the return type of this signature.
node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1495:27
 1495     reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 The expected type comes from the return type of this signature.

src/lib/utils/rating.utils.ts:32:48 - error TS18047: 'b' is possibly 'null'.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                                               ~

src/lib/utils/rating.utils.ts:54:40 - error TS2769: No overload matches this call.
Overload 1 of 3, '(callbackfn: (previousValue: RatingValue | null, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => RatingValue | null, initialValue: RatingValue | null): RatingValue | null', gave the following error.
 Type 'string' is not assignable to type 'RatingValue | null'.
Overload 2 of 3, '(callbackfn: (previousValue: number, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => number, initialValue: number): number', gave the following error.
 Type 'string' is not assignable to type 'number'.

54   const sum = ratings.reduce((a, b) => a + b, 0);
                                       ~~~~~

node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1489:24
 1489     reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 The expected type comes from the return type of this signature.
node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1495:27
 1495     reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 The expected type comes from the return type of this signature.

src/lib/utils/rating.utils.ts:54:44 - error TS18047: 'b' is possibly 'null'.

54   const sum = ratings.reduce((a, b) => a + b, 0);
                                           ~

src/lib/utils/rating.utils.ts:55:18 - error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

55   return Number((sum / ratings.length).toFixed(2));
                 ~~~

src/lib/utils/rating.utils.ts:55:18 - error TS18047: 'sum' is possibly 'null'.

55   return Number((sum / ratings.length).toFixed(2));
                 ~~~

src/lib/utils/rating.utils.ts:75:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'RatingValue' can't be used to index type 'Record<1 | 4 | 3 | 5 | 2, string>'.
Property 'clean' does not exist on type 'Record<1 | 4 | 3 | 5 | 2, string>'.

75   return RATING_EMOJI_MAP[rating] || '😐';
         ~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:86:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'RatingValue' can't be used to index type 'Record<1 | 4 | 3 | 5 | 2, { en: string; id: string; }>'.
Property 'clean' does not exist on type 'Record<1 | 4 | 3 | 5 | 2, { en: string; id: string; }>'.

86   return RATING_LABEL_MAP[rating]?.[lang] || 'Unknown';
         ~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:106:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'InspectionStatus' can't be used to index type '{ Excellent: { bg: string; text: string; badge: string; }; Good: { bg: string; text: string; badge: string; }; Fair: { bg: string; text: string; badge: string; }; Poor: { bg: string; text: string; badge: string; }; Critical: { ...; }; }'.

106   return colors[status] || colors.Fair;
          ~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:165:5 - error TS2353: Object literal may only specify known properties, and '1' does not exist in type 'Record<RatingValue, number>'.

165     1: 0,
     ~

src/lib/utils/type-helpers.ts:6:10 - error TS2305: Module '"@/core/types/database.types"' has no exported member 'Json'.

6 import { Json } from '@/core/types/database.types';
        ~~~~

src/lib/utils/type-helpers.ts:10:3 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'InspectionTemplate'. Did you mean 'InspectionTemplateFields'?

10   InspectionTemplate,
  ~~~~~~~~~~~~~~~~~~

src/lib/utils/type-helpers.ts:11:3 - error TS2459: Module '"@/core/types/inspection.types"' declares 'InspectionRecord' locally, but it is not exported.

11   InspectionRecord,
  ~~~~~~~~~~~~~~~~

src/core/types/inspection.types.ts:8:3
 8   InspectionRecord,
     ~~~~~~~~~~~~~~~~
 'InspectionRecord' is declared here.

src/lib/utils/validation.utils.ts:10:3 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'InspectionFormData'. Did you mean 'InspectionFormState'?

10   InspectionFormData,
  ~~~~~~~~~~~~~~~~~~

src/lib/utils/validation.utils.ts:52:68 - error TS18046: 'r' is of type 'unknown'.

52     const ratedCount = Object.values(data.responses).filter((r) => r.rating !== undefined).length;
                                                                   ~

src/lib/utils/validation.utils.ts:74:11 - error TS18046: 'response' is of type 'unknown'.

74       if (response.rating && response.rating <= 2 && !response.comment) {
          ~~~~~~~~

src/lib/utils/validation.utils.ts:74:30 - error TS18046: 'response' is of type 'unknown'.

74       if (response.rating && response.rating <= 2 && !response.comment) {
                             ~~~~~~~~

src/lib/utils/validation.utils.ts:74:55 - error TS18046: 'response' is of type 'unknown'.

74       if (response.rating && response.rating <= 2 && !response.comment) {
                                                      ~~~~~~~~

src/lib/utils/validation.utils.ts:133:27 - error TS2365: Operator '<' cannot be applied to types 'string' and 'number'.

133   if (response.rating && (response.rating < 1 || response.rating > 5)) {
                           ~~~~~~~~~~~~~~~~~~~

src/lib/utils/validation.utils.ts:133:50 - error TS2365: Operator '>' cannot be applied to types 'string' and 'number'.

133   if (response.rating && (response.rating < 1 || response.rating > 5)) {
                                                  ~~~~~~~~~~~~~~~~~~~

src/lib/utils/validation.utils.ts:142:26 - error TS2365: Operator '<=' cannot be applied to types 'string' and 'number'.

142   if (response.rating && response.rating <= 2 && !response.comment) {
                          ~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:35 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                   ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:38 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                      ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:41 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                         ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:44 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                            ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:47 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                               ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:35 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                   ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:38 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                      ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:41 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                         ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:44 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                            ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:47 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                               ~

src/presentation/components/features/Inspection/InspectionForm.tsx:9:10 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionRecordInsert'.

9 import { InspectionRecordInsert, InspectionTemplateInsert, LocationInsert } from '@/infrastructure/database/supabase';
        ~~~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/Inspection/InspectionForm.tsx:9:34 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'InspectionTemplateInsert'.

9 import { InspectionRecordInsert, InspectionTemplateInsert, LocationInsert } from '@/infrastructure/database/supabase';
                                ~~~~~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/Inspection/InspectionForm.tsx:9:60 - error TS2305: Module '"@/infrastructure/database/supabase"' has no exported member 'LocationInsert'.

9 import { InspectionRecordInsert, InspectionTemplateInsert, LocationInsert } from '@/infrastructure/database/supabase';
                                                          ~~~~~~~~~~~~~~

src/presentation/components/features/Inspection/InspectionForm.tsx:473:11 - error TS2322: Type 'string | null' is not assignable to type 'string | undefined'.
Type 'null' is not assignable to type 'string | undefined'.

473           locationName={state.locationName}
           ~~~~~~~~~~~~

src/presentation/components/features/Inspection/LocationModeSwitcher.tsx:18:3
 18   locationName?: string;
      ~~~~~~~~~~~~
 The expected type comes from property 'locationName' which is declared here on type 'IntrinsicAttributes & LocationModeSwitcherProps'

src/presentation/components/features/Inspection/InspectionForm.tsx:497:17 - error TS2322: Type '"clean" | "needs_work" | "dirty" | null' is not assignable to type 'RatingValue | undefined'.
Type 'null' is not assignable to type 'RatingValue | undefined'.

497                 value={response?.rating || null}
                 ~~~~~

src/presentation/components/features/Inspection/ComponentRating.tsx:17:3
 17   value?: RatingValue;
      ~~~~~
 The expected type comes from property 'value' which is declared here on type 'IntrinsicAttributes & ComponentRatingProps'

src/presentation/components/features/Inspection/InspectionForm.tsx:517:19 - error TS2322: Type '{ onCapture: (file: PhotoUploadItem) => void; mode: PhotoMode; }' is not assignable to type 'IntrinsicAttributes & PhotoCaptureProps'.
Property 'mode' does not exist on type 'IntrinsicAttributes & PhotoCaptureProps'.

517                   mode={state.photoMode}
                   ~~~~

src/presentation/components/features/Inspection/InspectionForm.tsx:533:19 - error TS2322: Type '(preview: string) => void' is not assignable to type '() => void'.
Target signature provides too few arguments. Expected 1 or more, but got 0.

533                   onRemove={removePhoto}
                   ~~~~~~~~

src/presentation/components/features/Inspection/PhotoPreview.tsx:8:3
 8   onRemove?: () => void;
     ~~~~~~~~
 The expected type comes from property 'onRemove' which is declared here on type 'IntrinsicAttributes & PhotoPreviewProps'

src/presentation/components/features/Inspection/InspectionForm.tsx:591:9 - error TS2322: Type '{ isOpen: boolean; onClose: () => void; onSave: (comment: string) => void; initialValue: string; componentLabel: string; }' is not assignable to type 'IntrinsicAttributes & CommentModalProps'.
Property 'componentLabel' does not exist on type 'IntrinsicAttributes & CommentModalProps'. Did you mean 'componentName'?

591         componentLabel={
         ~~~~~~~~~~~~~~

src/presentation/components/features/Inspection/PhotoCapture.tsx:9:10 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'PhotoUploadItem'.

9 import { PhotoUploadItem } from '@/core/types/inspection.types';
        ~~~~~~~~~~~~~~~

src/presentation/components/features/Inspection/QRSCannerModal.tsx:10:33 - error TS2306: File '/DataPopOS/toilet-monitoring/src/infrastructure/services/location.service.ts' is not a module.

10 import { locationService } from '@/infrastructure/services/location.service';
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:8:21 - error TS2305: Module '"../../../../lib/constants/locations"' has no exported member 'searchLocations'.

8 import { LOCATIONS, searchLocations } from '../../../../lib/constants/locations';
                   ~~~~~~~~~~~~~~~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:23:74 - error TS2345: Argument of type 'Location[]' is not assignable to parameter of type 'Location[] | (() => Location[])'.
Type 'Location[]' is not assignable to type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location[]'.
 Property 'code' is missing in type 'Location' but required in type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location'.

23   const [filteredLocations, setFilteredLocations] = useState<Location[]>(LOCATIONS);
                                                                         ~~~~~~~~~

src/core/types/interfaces.ts:24:3
 24   code: string;
      ~~~~
 'code' is declared here.

src/presentation/components/features/LocationSelector/LocationSelector.tsx:31:28 - error TS2345: Argument of type 'Location[]' is not assignable to parameter of type 'SetStateAction<Location[]>'.
Type 'Location[]' is not assignable to type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location[]'.
 Property 'code' is missing in type 'Location' but required in type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location'.

31       setFilteredLocations(LOCATIONS);
                           ~~~~~~~~~

src/core/types/interfaces.ts:24:3
 24   code: string;
      ~~~~
 'code' is declared here.

src/presentation/components/features/LocationSelector/LocationSelector.tsx:91:15 - error TS2322: Type '"default" | "selected"' is not assignable to type '"default" | "elevated" | "outlined" | undefined'.
Type '"selected"' is not assignable to type '"default" | "elevated" | "outlined" | undefined'.

91               variant={selectedLocationId === location.id ? 'selected' : 'default'}
              ~~~~~~~

src/presentation/components/ui/Card/Card.tsx:13:3
 13   variant?: 'default' | 'elevated' | 'outlined';
      ~~~~~~~
 The expected type comes from property 'variant' which is declared here on type 'IntrinsicAttributes & CardProps'

src/presentation/components/features/LocationSelector/LocationSelector.tsx:94:27 - error TS7006: Parameter 'e' implicitly has an 'any' type.

94               onKeyDown={(e) => handleKeyPress(e, location)}
                          ~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:106:29 - error TS2339: Property 'description' does not exist on type 'Location'.

106                   {location.description && (
                             ~~~~~~~~~~~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:107:68 - error TS2339: Property 'description' does not exist on type 'Location'.

107                     <span className={styles.description}>{location.description}</span>
                                                                    ~~~~~~~~~~~

src/presentation/components/features/PhotoCapture/index.ts:1:41 - error TS2307: Cannot find module './PhotoCapture/PhotoCapture' or its corresponding type declarations.

1 export { default as PhotoCapture } from './PhotoCapture/PhotoCapture';
                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/Reports/InspectionDetailModal.tsx:8:10 - error TS2305: Module '"@/core/entities/Inspection"' has no exported member 'InspectionEntity'.

8 import { InspectionEntity } from '@/core/entities/Inspection';
        ~~~~~~~~~~~~~~~~

src/presentation/components/features/Reports/InspectionDetailModal.tsx:220:71 - error TS2339: Property 'icon' does not exist on type 'AssessmentCategory'.

220                       <span className={styles.assessmentIcon}>{config.icon}</span>
                                                                       ~~~~

src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx:150:34 - error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Assessments'.
No index signature with a parameter of type 'string' was found on type 'Assessments'.

150               const assessment = assessments[config.id];
                                  ~~~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx:160:69 - error TS2339: Property 'icon' does not exist on type 'AssessmentCategory'.

160                     <span className={styles.assessmentIcon}>{config.icon}</span>
                                                                     ~~~~

src/presentation/components/layout/Header/Header.tsx:29:49 - error TS2339: Property 'role' does not exist on type 'User'.

29         <span className={styles.userRole}>{user.role}</span>
                                                ~~~~

src/presentation/hooks/useGeolocation.ts:46:27 - error TS2339: Property 'formatted_address' does not exist on type 'GeolocationData'.

46         address: position.formatted_address || 'No address',
                          ~~~~~~~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:15:3 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'InspectionFormData'. Did you mean 'InspectionFormState'?

15   InspectionFormData,
  ~~~~~~~~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:16:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'InspectionDraft'.

16   InspectionDraft,
  ~~~~~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:17:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'PhotoUploadItem'.

17   PhotoUploadItem,
  ~~~~~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:18:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'UseInspectionReturn'.

18   UseInspectionReturn,
  ~~~~~~~~~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:23:10 - error TS2724: '"@/infrastructure/services/inspection.service"' has no exported member named 'inspectionService'. Did you mean 'typedInspectionService'?

23 import { inspectionService } from '@/infrastructure/services/inspection.service';
         ~~~~~~~~~~~~~~~~~

src/infrastructure/services/inspection.service.ts:5:14
 5 export const typedInspectionService = {
                ~~~~~~~~~~~~~~~~~~~~~~
 'typedInspectionService' is declared here.

src/presentation/hooks/useInspection.ts:25:33 - error TS2306: File '/DataPopOS/toilet-monitoring/src/infrastructure/services/location.service.ts' is not a module.

25 import { locationService } from '@/infrastructure/services/location.service';
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:47:5 - error TS2322: Type 'null' is not assignable to type 'number'.

47     startTime: null,
    ~~~~~~~~~

src/presentation/hooks/useInspection.ts:52:7 - error TS2353: Object literal may only specify known properties, and 'currentStep' does not exist in type 'InspectionUIState'.

52       currentStep: 1,
      ~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:135:25 - error TS2339: Property 'isDraft' does not exist on type 'InspectionUIState'.

135       if (state.uiState.isDraft && Object.keys(state.responses).length > 0) {
                         ~~~~~~~

src/presentation/hooks/useInspection.ts:221:20 - error TS2339: Property 'photos' does not exist on type 'InspectionFormState'.

221       photos: prev.photos.filter((p) => p.id !== photoId),
                    ~~~~~~

src/presentation/hooks/useInspection.ts:221:35 - error TS7006: Parameter 'p' implicitly has an 'any' type.

221       photos: prev.photos.filter((p) => p.id !== photoId),
                                   ~

src/presentation/hooks/useInspection.ts:334:34 - error TS2339: Property 'photos' does not exist on type 'InspectionFormState'.

334       let uploadedPhotos = state.photos;
                                  ~~~~~~

src/presentation/hooks/useInspection.ts:352:41 - error TS7006: Parameter 'p' implicitly has an 'any' type.

352         photo_urls: uploadedPhotos.map((p) => p.file_url),
                                         ~

src/presentation/hooks/useInspection.ts:406:25 - error TS2339: Property 'photos' does not exist on type 'InspectionFormState'.

406       photo_urls: state.photos.map((p) => p.file_url),
                         ~~~~~~

src/presentation/hooks/useInspection.ts:406:37 - error TS7006: Parameter 'p' implicitly has an 'any' type.

406       photo_urls: state.photos.map((p) => p.file_url),
                                     ~

src/presentation/hooks/useInspection.ts:458:30 - error TS2339: Property 'isSubmitting' does not exist on type 'InspectionUIState'.

458     isLoading: state.uiState.isSubmitting,
                              ~~~~~~~~~~~~

src/presentation/hooks/usePhotoUpload.ts:10:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'PhotoUploadItem'.

10   PhotoUploadItem,
  ~~~~~~~~~~~~~~~

src/presentation/hooks/usePhotoUpload.ts:11:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'PhotoMetadata'.

11   PhotoMetadata,
  ~~~~~~~~~~~~~

src/presentation/hooks/usePhotoUpload.ts:12:3 - error TS2305: Module '"@/core/types/inspection.types"' has no exported member 'CloudinaryUploadResponse'.

12   CloudinaryUploadResponse,
  ~~~~~~~~~~~~~~~~~~~~~~~~


Found 167 errors in 51 files.

Errors  Files
  2  .next/types/app/api/templates/[id]/route.ts:12
  1  .next/types/validator.ts:288
 12  backup-20251021-210524/InspectionForm.backup.tsx:9
  6  backup-20251021-210524/inspection.types.aligned.ts:7
  6  backup-20251021-210524/inspection.types.backup.ts:7
  2  src/app/api/inspections/route.ts:7
  1  src/app/dashboard/inspection/page.tsx:26
  4  src/app/dashboard/inspection/success/page.tsx:10
  1  src/app/dashboard/layout.tsx:78
  3  src/app/dashboard/locations/create/page.tsx:127
  1  src/app/dashboard/locations/print-qr/page.tsx:48
  2  src/app/dashboard/scan/page.tsx:11
  4  src/app/inspection/success/page.tsx:10
  1  src/core/dtos/CreateInspectionDTO.ts:2
  1  src/core/entities/Assessment.ts:2
  1  src/core/entities/Inspection.ts:1
  1  src/core/entities/InspectionTemplate.ts:2
  1  src/core/entities/Location.ts:1
  3  src/core/repositories/IInspectionRepository.ts:3
  1  src/core/repositories/IPhotoRepository.ts:2
  1  src/core/types/database.types.ts:7
  1  src/core/types/index.ts:15
  1  src/core/use-cases/GetCurrentUserUseCase.ts:4
  1  src/core/use-cases/UploadPhoto.ts:31
  1  src/infrastructure/database/repositories/InspectionTemplateRepository.ts:4
  1  src/infrastructure/database/repositories/SupabaseLocationRepository.ts:7
  1  src/infrastructure/database/supabase.ts:7
  3  src/infrastructure/services/cloudinary.service.ts:7
  2  src/infrastructure/services/index.ts:5
  1  src/infrastructure/services/inspection.service.ts:2
  2  src/infrastructure/services/notification.service.ts:15
  1  src/infrastructure/services/template.service.ts:3
  2  src/infrastructure/storage/CloudinaryPhotoRepository.ts:2
 11  src/lib/constants/inspection.constants.ts:17
  2  src/lib/di.ts:19
  5  src/lib/utils/geolocation.utils.ts:61
 13  src/lib/utils/rating.utils.ts:8
  3  src/lib/utils/type-helpers.ts:6
  8  src/lib/utils/validation.utils.ts:10
 10  src/presentation/components/features/Inspection/ComponentRating.tsx:122
  8  src/presentation/components/features/Inspection/InspectionForm.tsx:9
  1  src/presentation/components/features/Inspection/PhotoCapture.tsx:9
  1  src/presentation/components/features/Inspection/QRSCannerModal.tsx:10
  7  src/presentation/components/features/LocationSelector/LocationSelector.tsx:8
  1  src/presentation/components/features/PhotoCapture/index.ts:1
  2  src/presentation/components/features/Reports/InspectionDetailModal.tsx:8
  2  src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx:150
  1  src/presentation/components/layout/Header/Header.tsx:29
  1  src/presentation/hooks/useGeolocation.ts:46
 16  src/presentation/hooks/useInspection.ts:15
  3  src/presentation/hooks/usePhotoUpload.ts:10
dracarys@pop-os:~/toilet-monitoring$

```
