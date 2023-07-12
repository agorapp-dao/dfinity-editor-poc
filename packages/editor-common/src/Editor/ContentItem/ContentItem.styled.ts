import styled, { css } from 'styled-components';

type TProps = {
  level: number;
};

export const Wrapper = styled.div<TProps>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: ${p => p.level * 0.3}rem;
`;

interface RowProps {
  $noContent?: boolean;
}

export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${p => (p.$noContent ? p.theme.mutedText : p.theme.intenseText)};
`;

export const ActiveLink = styled.button`
  border: 0;
  background: transparent;
  font-size: 1rem;
  width: 100%;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;

  &:hover {
    background: ${p => p.theme.lessonLinkHover};
  }

  strong {
    font-weight: 300;
  }

  :hover {
    strong {
      color: ${p => p.theme.linkHover};
    }
  }
`;

interface ILevelProps {
  level: number;
}

export const Number = styled.div<ILevelProps>`
  width: 2.4rem;
  text-align: left;
  ${({ level }) =>
    level === 1 &&
    css`
      width: 1.8rem;
    `}
`;

export const Name = styled.div<TProps>`
  flex: 1 1 auto;
  text-align: left;
`;
