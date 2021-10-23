import { FC } from 'react';
import styles from './Template.module.css';

interface TemplateProps {
  title: string;
}

const Template: FC<TemplateProps> = ({ title, children }) => (
  <div className={styles.container}>
    <main className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </main>
  </div>
);

export default Template;
