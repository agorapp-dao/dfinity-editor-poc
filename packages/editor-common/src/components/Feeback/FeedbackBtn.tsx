import ChatIcon from '@mui/icons-material/Chat';
import { Button } from '@mui/material';
import * as S from './FeedbackBtn.styled';
import { GITHUB_CREATE_ISSUE_URL } from '../../constants/config';

type TProps = {
  userCode: string;

  slug: string;
};

export const FeedbackBtn = ({ userCode, slug }: TProps) => {
  const openFeedback = () => {
    // https://docs.github.com/en/github-ae@latest/issues/tracking-your-work-with-issues/creating-an-issue
    const queryParams: string[] = [];

    const title = `feedback: ${slug}`;
    queryParams.push(`title=${encodeURIComponent(title)}`);

    const body = `
I have following feedback:

My code is:
\`\`\`
${userCode}
\`\`\``;
    queryParams.push(`body=${encodeURIComponent(body)}`);

    const anchor = document.createElement('a');
    anchor.href = `${GITHUB_CREATE_ISSUE_URL}?${queryParams.join('&')}`;
    anchor.target = '_blank';
    anchor.click();
  };

  return (
    <S.Wrapper>
      <S.Rotate>
        <S.InnerWrapper>
          <Button onClick={openFeedback} startIcon={<ChatIcon />} sx={{ borderRadius: '1.6rem' }}>
            Feedback
          </Button>
        </S.InnerWrapper>
      </S.Rotate>
    </S.Wrapper>
  );
};