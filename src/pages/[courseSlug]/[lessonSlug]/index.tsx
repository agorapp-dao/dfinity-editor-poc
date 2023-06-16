import fs from 'fs/promises';
import { SWRConfig } from 'swr';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { muiDarkTheme, theme } from '@/src/styles/themes';
import { EditorProvider } from '@/src/features/editor/context/EditorContext';
import { CssBaseline } from '@mui/material';
import * as S from '@/src/styles/global.styled';
import Editor from '@/src/features/editor/components/Editor/Editor';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { MOTOKO_TUTORIAL_COURSE } from '@/src/features/editor/constants/motokoTutorial';
import React, { useEffect, useState } from 'react';
import { GlobalStyle } from '@/src/styles/global.styled';
import { useRouter } from 'next/router';
import { courseService } from '@/src/features/editor/services/courseService';

type TEditorPageProps = {
  lessonSlug: string | undefined;
  courseSlug: string;
  fallback: { [key: string]: any };
};

export default function EditorPage({ courseSlug, lessonSlug, fallback }: TEditorPageProps) {
  const [activeLessonSlug, setActiveLessonSlug] = useState(lessonSlug);
  const router = useRouter();

  useEffect(() => {
    setActiveLessonSlug(router.query.lessonSlug as string);
  }, [router.query.lessonSlug]);

  return (
    <SWRConfig value={{ fallback }}>
      <EditorProvider
        courseSlug={courseSlug}
        activeLessonSlug={activeLessonSlug}
        setActiveLessonSlug={setActiveLessonSlug}
      >
        <MuiThemeProvider theme={muiDarkTheme}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <S.Main>
              <Editor />
            </S.Main>
          </ThemeProvider>
        </MuiThemeProvider>
      </EditorProvider>
    </SWRConfig>
  );
}

type TEditorPageParams = {
  courseSlug: string;
  lessonSlug: string;
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<TEditorPageParams>,
): Promise<GetServerSidePropsResult<TEditorPageProps>> {
  if (!ctx.params) {
    throw new Error('todo');
  }

  const fallback: { [key: string]: any } = {};

  fallback['/api/course/motoko-tutorial'] = MOTOKO_TUTORIAL_COURSE;

  const lesson = courseService.findLesson(MOTOKO_TUTORIAL_COURSE, ctx.params.lessonSlug);
  if (lesson?.content) {
    const content = await fs.readFile('./public' + lesson.content[0].markdown, 'utf-8');
    fallback[lesson.content[0].markdown] = content;
  }

  return {
    props: { courseSlug: ctx.params.courseSlug, lessonSlug: ctx.params.lessonSlug, fallback },
  };
}
