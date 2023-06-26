import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Tabs } from '@mui/material';
import { EditorContext } from '../../EditorContext';
import { courseService } from '../../../services/courseService';
import { PanelTab } from '../../../components/PanelTab/PanelTab';
import { FullscreenControl } from '../../../components/FullscreenControl/FullscreenControl';
import { MonacoEditor } from '../../Monaco/MonacoEditor';
import { IEditorFile } from '../../../types/IEditorFile';

export const SectionCode = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { courseSlug, activeLessonSlug, files, setFiles } = useContext(EditorContext);
  const course = courseService.useCourse(courseSlug);
  let mounted = true;

  useEffect(() => {
    const fetchFiles = async () => {
      if (!mounted || !course.data || !activeLessonSlug) {
        return;
      }

      const files_ = await courseService.getLessonFiles(course.data, activeLessonSlug);
      setFiles(files_);

      return () => {
        mounted = false;
      };
    };

    fetchFiles();
  }, [course.data, activeLessonSlug]);

  const changeActiveTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleValueChange = (value: string) => {
    setFiles(files => {
      files[activeTab].content = value;
      return [...files];
    });
  };

  if (!files.length) {
    return <div></div>;
  }

  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flex: '1 1 auto' }}>
          <Tabs value={activeTab} onChange={changeActiveTab}>
            {files?.map((file, index) => (
              <PanelTab label={file.path.split('/').pop()} key={index} value={index} />
            ))}
          </Tabs>
        </Box>
        <FullscreenControl />
      </Box>
      {/*TODO: get language from extension of activeLesson.files[activeTab] */}
      <MonacoEditor
        language="motoko"
        value={files[activeTab]?.content}
        onValueChange={handleValueChange}
      />
    </>
  );
};
