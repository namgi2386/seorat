import { useState } from 'react';
import styles from './App.module.css';
import seorinGif from '../assets/seorin-boxing.gif';

const WIN_URL = 'https://github.com/namgi2386/seorat/releases/download/v1.1.0/pocket-seorin-win.zip';
const MAC_URL = 'https://github.com/namgi2386/seorat/releases/download/v1.1.0/pocket.seorin-1.0.0-arm64.dmg';

export default function App() {
  const [winOpen, setWinOpen] = useState(false);
  const [macOpen, setMacOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.subtitle}>당신의 데스크탑 위에 항상 함께</p>
        <h1 className={styles.title}>pocket seorin</h1>
        <a
          href="https://github.com/namgi2386/seorat"
          className={styles.subtitleLink}
          target="_blank"
          rel="noreferrer"
        >made by imnamgi (깃헙 이동하기)</a>
      </header>

      <section className={styles.section}>
        <div className={styles.gifWrapper}>
          <img src={seorinGif} alt="pocket seorin 미리보기" className={styles.previewGif} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>다운로드</h2>
        <div className={styles.downloadRow}>
          <a href={WIN_URL} className={styles.downloadBtn} download>
            <span className={styles.btnIcon}>🪟</span>
            <span>
              <strong>Windows</strong>
              <small>zip 압축 해제 후 실행</small>
            </span>
          </a>
          <a href={MAC_URL} className={styles.downloadBtn} download>
            <span className={styles.btnIcon}>🍎</span>
            <span>
              <strong>macOS</strong>
              <small>Apple Silicon (.dmg)</small>
            </span>
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>설치 방법</h2>
        <div className={styles.guide}>
          <h3>Windows</h3>
          <ol>
            <li>위 버튼을 눌러 zip 파일을 다운로드합니다.</li>
            <li>zip 파일의 압축을 해제합니다.</li>
            <li><code>pocket seorin.exe</code>를 실행합니다.</li>
          </ol>

          <button
            className={styles.toggleBtn}
            onClick={() => setWinOpen(v => !v)}
          >
            {winOpen ? '▲' : '▼'} &nbsp;
            "Windows에서 PC를 보호했습니다" 경고가 뜨는 경우
          </button>
          {winOpen && (
            <div className={styles.toggleContent}>
              <p>앱이 코드 서명되지 않아 SmartScreen 경고가 표시됩니다. 아래 순서로 실행하세요.</p>
              <ol>
                <li>경고 창에서 <strong>"추가 정보"</strong> 클릭</li>
                <li><strong>"실행"</strong> 버튼 클릭</li>
              </ol>
            </div>
          )}

          <h3 style={{ marginTop: '2rem' }}>macOS</h3>
          <button
            className={styles.toggleBtn}
            onClick={() => setMacOpen(v => !v)}
          >
            {macOpen ? '▲' : '▼'} &nbsp;
            "개발자를 확인할 수 없음" 경고가 뜨는 경우
          </button>
          {macOpen && (
            <div className={styles.toggleContent}>
              <p>Gatekeeper 보안 정책으로 인해 경고가 표시됩니다. 아래 순서로 실행하세요.</p>
              <ol>
                <li>앱 파일을 <strong>우클릭 → 열기</strong> 선택</li>
                <li>경고 창에서 <strong>"열기"</strong> 클릭</li>
                <li>이후에는 일반적으로 실행 가능합니다.</li>
              </ol>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 pocket seorin</p>
      </footer>
    </div>
  );
}
