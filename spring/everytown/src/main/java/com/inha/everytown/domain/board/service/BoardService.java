package com.inha.everytown.domain.board.service;

import com.inha.everytown.domain.board.dto.BoardSaveReqDto;
import com.inha.everytown.domain.board.dto.BoardResDto;
import com.inha.everytown.domain.board.dto.BoardSearchResDto;
import com.inha.everytown.domain.board.dto.BoardUpdateReqDto;
import com.inha.everytown.domain.board.entity.relation.Board;
import com.inha.everytown.domain.board.entity.relation.BoardCategory;
import com.inha.everytown.domain.board.repository.document.BoardDocRepository;
import com.inha.everytown.domain.board.repository.relation.BoardCategoryRepository;
import com.inha.everytown.domain.board.repository.relation.BoardRepository;
import com.inha.everytown.domain.member.entity.Member;
import com.inha.everytown.domain.member.repository.MemberRepository;
import com.inha.everytown.global.exception.CustomException;
import com.inha.everytown.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final BoardCategoryRepository boardCategoryRepository;
    private final BoardDocRepository boardDocRepository;

    // 근처 게시글 가져오기
    public Page<BoardResDto> getBoardList(Long categoryId, double lat, double lon, int page) {
        Pageable pageable = getPageable(page, "relation");
        Page<BoardResDto> boardPage;
        if (categoryId == null) boardPage = boardRepository.findNearBoard(lat,lon,pageable).map(BoardResDto::EntityToDto);
        else boardPage = boardRepository.findNearBoardWithCategory(categoryId, lat, lon, pageable).map(BoardResDto::EntityToDto);
        return boardPage;
    }

    // 게시글 조회 -> 조회수 증가
    public BoardResDto viewBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new CustomException(ErrorCode.BOARD_NO_SUCH_BOARD)
        );
        board.increaseViewCnt();
        return BoardResDto.EntityToDto(board);
    }

    // 그냥 게시글 정보 가져오기 -> 조회수 증가 X, 필요할까봐 만듬
    public BoardResDto getBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new CustomException(ErrorCode.BOARD_NO_SUCH_BOARD)
        );
        return BoardResDto.EntityToDto(board);
    }

    // 게시글 저장 -> 귀찮아서 예외 처리 잘 안함
    public BoardResDto saveBoard(Long memberId, BoardSaveReqDto reqDto, double lat, double lon) {
        Member member = memberRepository.findById(memberId).orElseThrow(
                () -> new CustomException(ErrorCode.AUTH_MEMBER_NOT_FOUND)
        );
        BoardCategory boardCategory = boardCategoryRepository.findById(reqDto.getBoardCategory()).orElseThrow(
                () -> new CustomException(ErrorCode.BOARD_CATE_NO_SUCH_BOARD_CATE)
        );

        Board savedBoard = boardRepository.save(
                Board.builder()
                        .boardCategory(boardCategory)
                        .member(member)
                        .title(reqDto.getTitle())
                        .content(reqDto.getContent())
                        .address(reqDto.getAddress())
                        .latitude(new BigDecimal(lat))
                        .longitude(new BigDecimal(lon))
                        .commentCnt(0L)
                        .likeCnt(0L)
                        .viewCnt(0L)
                        .build()
        );

        return BoardResDto.EntityToDto(savedBoard);
    }

    // 게시글 수정
    public BoardResDto updateBoard(Long memberId, Long boardId, BoardUpdateReqDto reqDto) {
        Board board = boardRepository.findById(boardId).get();
        // 작성자 맞는지 검증 로직
        if(!memberId.equals(board.getMember().getId())) throw new CustomException(ErrorCode.UNAUTHORIZED_MEMBER);

        board.update(reqDto);
        return BoardResDto.EntityToDto(board);
    }

    public void deleteBoard(Long boardId) {
        boardRepository.deleteById(boardId);
        boardDocRepository.deleteById(boardId);
    }

    public boolean isWriter(Long memberId, Long boardId) {
        Board board = boardRepository.findById(boardId).get();
        if(memberId.equals(board.getMember().getId())) return true;
        return false;
    }

    public Page<BoardSearchResDto> search(String query, Long cateId, int page, double lat, double lon) {
        Pageable pageable = getPageable(page, "document");

        Page<BoardSearchResDto> result;
        if(cateId == null) result = boardDocRepository.findByQuery(query, lat, lon, pageable).map(BoardSearchResDto::DocToDto);
        else result = boardDocRepository.findByQueryWithCate(query, cateId, lat, lon, pageable).map(BoardSearchResDto::DocToDto);

        return result;
    }

    private Pageable getPageable(int page, String dataType) {
        String property = null;

        // mysql과 elastic의 필드명이 달라서 생기는 문제 -> 미리 맞춰두면 좋겠지만 지금은 시간이 없어 그냥 씀
        if (dataType.equals("relation")) property = "createdAt";
        else if (dataType.equals("document")) property = "created_at";

        Sort sort = Sort.by(Sort.Order.desc(property));
        return PageRequest.of(page, 20, sort);
    }
}