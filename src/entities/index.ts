/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: jobapplications
 * Interface for JobApplications
 */
export interface JobApplications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType date */
  applicationDate?: Date | string;
  /** @wixFieldType text */
  applicationStatus?: string;
  /** @wixFieldType text */
  companyResponse?: string;
  /** @wixFieldType url */
  jobPostingUrl?: string;
  /** @wixFieldType text */
  jobLocation?: string;
}


/**
 * Collection ID: resumeversions
 * Interface for ResumeVersions
 */
export interface ResumeVersions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  versionName?: string;
  /** @wixFieldType url */
  resumeFileUrl?: string;
  /** @wixFieldType datetime */
  uploadDate?: Date | string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType text */
  fileName?: string;
}
