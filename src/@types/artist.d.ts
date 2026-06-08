declare namespace Artist {
  interface IArtistParams {
    page?: number;
    limit?: number;
    search?: string;
    managerId?: string;
  }

  interface IArtist {
    id: string;
    user_id: string;
    manager_id: string | null;
    stage_name: string | null;
    dob: string | null;
    gender: string | null;
    address: string | null;
    first_release_year: number | null;
    email: string;
    name: string;
    user_status: string;
    manager_name: string | null;
    no_of_albums: number;
    no_of_musics: number;
    created_at: string;
    updated_at: string;
  }

  interface IUpdateArtistPayload {
    stageName?: string;
    dob?: string | null;
    gender?: string | null;
    address?: string | null;
    firstReleaseYear?: number | null;
    managerId?: string | null;
  }

  interface IDeleteArtistPayload {
    type: string;
  }

  interface IManagerOption {
    id: string;
    name: string;
  }

  type IPaginatedArtistResponse = Api.PaginatedData<IArtist>;

  interface IImportJobResponse {
    jobId: string;
  }

  interface IJobStatus {
    id: string;
    type: string;
    status: ImportStatusType;
    progress?: number;
    total?: number;
    result?: {
      imported: number;
      skipped: number;
    };
    error?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
  }
}
