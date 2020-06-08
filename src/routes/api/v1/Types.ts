export type Req = Request & {
  user: {
    id: string;
  };
  body: UserInfo & SocialTypes & {
    text?: string;
    title?: string;
    from?: string;
    to?: string;
    current?: string;
    description?: string;
    school?: string;
    degree?: string;
    fieldofstudy?: string;
  };
  params: {
    id?: string;
    comment_id?: string;
    exp_id?: string;
    edu_id?: string;
  }
};

type UserInfo = {
  user?: string;
  company?: string;
  location?: string;
  website?: string;
  bio?: string;
  skills?: any;
  status?: string;
  githubusername?: string;
};

type SocialTypes = {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
}

export type ProfileFieldsType = UserInfo &{
  social?: SocialTypes;
};
