import styled from "styled-components";

export default function Pagination({total, perPage, page, setPage}){
    
    const numPages = Math.ceil(total / perPage);
    const pageGroup = Math.ceil(page / 5)
	const last = pageGroup * 5 > numPages ? numPages : pageGroup * 5
	const first = pageGroup * 5 - 5

    // 페이지 배열 초기화
	const pages = [...Array(numPages)].map((_, i) => i)

	// 페이지 번호 생성
	const transform = (index) => {
		return (
			<button
				key={index}
				onClick={(e) => {
					e.preventDefault()
					setPage(index + 1)
				}}
				style={{color: index + 1 === page ? '#de4848' : '#121212', 
                        fontSize: '18px'}}
			>
				{index + 1}
			</button>
		)
	}

	// 페이지네이션 동적으로 생성
	const collapseRange = (pages, current, { max, transform }) => {
		const total = pages.length

		// 페이지 번호 컴포넌트 생성
		const getPageComponents = (startIndex = 0, lastIndex = total) => {
			return pages.slice(startIndex, lastIndex).map((page) => transform(page))
		}

		return getPageComponents(first, max)
	}
    return(
        <>
            <Nav>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    &lt;
                </Button>
                {collapseRange(pages, page, {
						max: last,
						transform,
					})}
                <Button onClick={() => setPage(page + 1)} disabled={page === numPages}>
                    &gt;
                </Button>
            </Nav>
        
        </>    
    );
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 16px;
`;

const Button = styled.button`
  border: none;
  border-radius: 8px;
  padding: 4px;
  margin: 0;
  background: black;
  color: white;
  font-size: 1rem;

  &:hover {
    background: tomato;
    cursor: pointer;
    transform: translateY(-2px);
  }

  &[disabled] {
    background: grey;
    cursor: revert;
    transform: revert;
  }

  &[aria-current] {
    background: deeppink;
    font-weight: bold;
    cursor: revert;
    transform: revert;
  }
`;