import React from 'react';
import styled from 'styled-components';
import Icon from '@ant-design/icons';
import {
  TwitterOutlined,
  LinkedinFilled,
  YoutubeFilled,
  GithubOutlined,
  MediumOutlined,
} from '@ant-design/icons';
import { ReactComponent as DiscordSvg } from '../../assets/Discord.svg';
import { ReactComponent as TelegramSvg } from '../../assets/Telegram.svg';

const StyledFooter = styled.div`
  width: 100%;
  padding-top: 25px;
  padding-bottom: 25px;
  background-color: #151515;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #777777;
`;

const StyledFooterLinks = styled.div`
  display: flex;
  > * {
    font-size: 1.5em;
    svg {
      fill: #777777;
      transition: all 0.15s linear;
      &:hover {
        fill: #00ff8f;
      }
    }
  }
  > *:not(:last-child) {
    margin-right: 15px;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <p style={{ textAlign: 'center' }}>
        © 2020{' '}
        <a href="https://tellor.io" rel="noopener noreferrer" target="_blank">
          Tellor.io
        </a>
      </p>
      <StyledFooterLinks>
        <a
          href="https://twitter.com/wearetellor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <TwitterOutlined />
        </a>
        <a
          href="https://www.linkedin.com/company/tellorinc/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkedinFilled />
        </a>
        <a
          href="https://www.youtube.com/channel/UCJteW6bsm1wn34i2hSAZBiw?view_as=subscriber"
          rel="noopener noreferrer"
          target="_blank"
        >
          <YoutubeFilled />
        </a>
        <a
          href="https://github.com/tellor-io/TellorCore"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GithubOutlined />
        </a>
        <a href="https://t.me/tellor" rel="noopener noreferrer" target="_blank">
          <Icon component={TelegramSvg} />
        </a>
        <a
          href="https://medium.com/tellor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <MediumOutlined />
        </a>
        <a
          href="https://discord.com/invite/n7drGjh"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon component={DiscordSvg} />
        </a>
      </StyledFooterLinks>
    </StyledFooter>
  );
};

export default Footer;
